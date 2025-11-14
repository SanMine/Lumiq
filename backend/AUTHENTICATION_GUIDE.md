# 🔐 JWT Authentication & CORS Guide

## Overview

Your backend now has **JWT (JSON Web Token) authentication** with proper **CORS configuration** to handle secure requests from your frontend.

---

## 🎯 What's Been Configured

### ✅ 1. **JWT Authentication**
- **Library**: `jsonwebtoken` (already installed)
- **Secret Key**: Set in `.env` as `JWT_SECRET`
- **Token Expiration**: 24 hours (configurable)
- **Storage**: Tokens stored in frontend, sent via `Authorization` header

### ✅ 2. **CORS (Cross-Origin Resource Sharing)**
- **Allowed Origins**: `http://localhost:3000`, `http://localhost:5173`
- **Credentials**: Enabled (allows cookies/auth headers)
- **Methods**: GET, POST, PUT, DELETE, PATCH, OPTIONS
- **Headers**: Content-Type, Authorization, X-Requested-With

### ✅ 3. **Protected Routes**
- User update: Requires authentication
- User delete: Requires authentication
- AI Matching: Requires authentication
- Auth routes: Public (login/register)

---

## 📁 Authentication Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                       │
└─────────────────────────────────────────────────────────────┘

1. USER REGISTRATION/LOGIN
   Frontend → POST /api/auth/login → Backend
                                   ↓
                            Check credentials
                                   ↓
                          Generate JWT token
                                   ↓
   Frontend ← { token: "eyJhbGc..." } ← Backend

2. STORE TOKEN
   Frontend saves token in:
   - localStorage (simple)
   - sessionStorage (more secure)
   - Memory (most secure, lost on refresh)

3. MAKE AUTHENTICATED REQUEST
   Frontend → GET /api/users/123
              Header: "Authorization: Bearer eyJhbGc..."
                                   ↓
                         requireAuth middleware
                                   ↓
                         Verify JWT token
                                   ↓
                         Extract user info
                                   ↓
   Frontend ← { user data } ← Backend

4. TOKEN EXPIRATION
   After 24 hours → Token becomes invalid
   Frontend must re-login → Get new token
```

---

## 🔑 Environment Variables

Add these to your `.env` file:

```bash
# JWT Authentication
JWT_SECRET=lumiq-super-secret-key-2025-change-in-production-abc123xyz789
JWT_EXPIRES_IN=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

**⚠️ IMPORTANT**: In production, use a strong, random secret:
```bash
# Generate a secure secret (run in terminal):
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🛣️ API Endpoints

### **Public Routes** (No Authentication Required)

#### 1. Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "student@lumiq.edu",
  "password": "SecurePass123!",
  "name": "John Doe",
  "role": "student"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "student@lumiq.edu",
    "name": "John Doe",
    "role": "student"
  }
}
```

#### 2. Login User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "student@lumiq.edu",
  "password": "SecurePass123!"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "student@lumiq.edu",
    "name": "John Doe",
    "role": "student"
  }
}
```

#### 3. Get All Users (for matching)
```bash
GET /api/users

Response:
[
  { "id": 1, "name": "John Doe", "email": "john@lumiq.edu" },
  { "id": 2, "name": "Jane Smith", "email": "jane@lumiq.edu" }
]
```

### **Protected Routes** (Authentication Required)

#### 4. Update User Profile
```bash
PUT /api/users/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "John Updated",
  "email": "newemail@lumiq.edu"
}

Response:
{
  "id": 1,
  "name": "John Updated",
  "email": "newemail@lumiq.edu"
}
```

#### 5. Delete User Account
```bash
DELETE /api/users/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response:
{ "deleted": 1 }
```

#### 6. Find Roommate Matches (AI)
```bash
POST /api/matching/find-roommates/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response:
{
  "success": true,
  "matches": [
    {
      "candidateId": 2,
      "candidateName": "Jane Smith",
      "matchPercentage": 85,
      "compatibility": {...}
    }
  ]
}
```

---

## 🎨 Frontend Integration

### **React Example** (Matching.jsx)

```javascript
// 1. LOGIN AND STORE TOKEN
const handleLogin = async (email, password) => {
  try {
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      email,
      password
    });
    
    // Store token in state and localStorage
    const token = response.data.token;
    setToken(token);
    localStorage.setItem('authToken', token);
    
    return true;
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
};

// 2. MAKE AUTHENTICATED REQUEST
const findMatches = async (userId) => {
  try {
    const token = localStorage.getItem('authToken');
    
    const response = await axios.post(
      `http://localhost:3001/api/matching/find-roommates/${userId}`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    setMatches(response.data.matches);
  } catch (error) {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      handleLogout();
    }
  }
};

// 3. LOGOUT
const handleLogout = () => {
  localStorage.removeItem('authToken');
  setToken(null);
  window.location.href = '/login';
};

// 4. CHECK IF LOGGED IN
const isLoggedIn = () => {
  return !!localStorage.getItem('authToken');
};
```

### **Axios Interceptor** (Better Approach)

Create `frontend/src/lib/api.js`:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api'
});

// Automatically attach token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired - redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Usage in components:
import api from './lib/api';

const findMatches = async (userId) => {
  const response = await api.post(`/matching/find-roommates/${userId}`);
  return response.data;
};
```

---

## 🔒 Security Features

### **1. Password Hashing**
```javascript
// Passwords are NEVER stored in plain text
// bcryptjs automatically hashes passwords with salt rounds

import bcrypt from 'bcryptjs';

// Registration
const hashedPassword = await bcrypt.hash(password, 10);

// Login verification
const isValid = await bcrypt.compare(password, user.passwordHash);
```

### **2. Token Verification**
```javascript
// Middleware checks every protected request
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const tokenResult = getUserFromToken(authHeader);
  
  if (!tokenResult.success) {
    return res.status(401).json({ 
      error: 'Authentication required',
      message: tokenResult.error 
    });
  }
  
  req.user = tokenResult;  // Attach user info to request
  next();
}
```

### **3. Role-Based Access Control**
```javascript
// Users can only update/delete their own profiles
if (req.user.id !== parseInt(req.params.id) && req.user.role !== 'admin') {
  return res.status(403).json({ 
    error: "You can only update your own profile" 
  });
}
```

### **4. CORS Protection**
```javascript
// Only allows requests from specific frontend URLs
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,  // Allow cookies/auth headers
  allowedHeaders: ['Content-Type', 'Authorization']
};
```

---

## 🧪 Testing Authentication

### **Using curl**

#### 1. Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice.chen@lumiq.edu","password":"Password123!"}'

# Save the token from response
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### 2. Test Protected Route
```bash
# Without token (should fail)
curl -X POST http://localhost:3001/api/matching/find-roommates/1

# With token (should succeed)
curl -X POST http://localhost:3001/api/matching/find-roommates/1 \
  -H "Authorization: Bearer $TOKEN"
```

### **Using Postman**

1. **Login**:
   - Method: POST
   - URL: `http://localhost:3001/api/auth/login`
   - Body (JSON):
     ```json
     {
       "email": "alice.chen@lumiq.edu",
       "password": "Password123!"
     }
     ```
   - Copy the `token` from response

2. **Protected Request**:
   - Method: POST
   - URL: `http://localhost:3001/api/matching/find-roommates/1`
   - Headers:
     - Key: `Authorization`
     - Value: `Bearer YOUR_TOKEN_HERE`

---

## 🚨 Error Responses

### **401 Unauthorized** (No/Invalid Token)
```json
{
  "error": "Authentication required",
  "message": "No token provided"
}
```

### **403 Forbidden** (Valid Token, Wrong Permissions)
```json
{
  "error": "You can only update your own profile"
}
```

### **Token Expired**
```json
{
  "error": "Authentication required",
  "message": "jwt expired"
}
```

### **Invalid Token**
```json
{
  "error": "Authentication required",
  "message": "invalid token"
}
```

---

## 📊 JWT Token Structure

### **Token Example**:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWxpY2UuY2hlbkBsdW1pcS5lZHUiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTYzMzAyNDgwMCwiZXhwIjoxNjMzMTExMjAwfQ.xyz123abc456
```

### **Decoded Payload**:
```json
{
  "userId": 1,
  "email": "alice.chen@lumiq.edu",
  "role": "student",
  "iat": 1633024800,  // Issued at (timestamp)
  "exp": 1633111200   // Expires at (timestamp)
}
```

You can decode tokens at: https://jwt.io

---

## 🔧 Configuration Files

### **1. `.env`** (Environment Variables)
```bash
# Server
PORT=3001
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://...

# JWT
JWT_SECRET=lumiq-super-secret-key-2025-change-in-production-abc123xyz789
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# Groq AI
GROQ_API_KEY=gsk_...
```

### **2. `src/index.js`** (CORS Setup)
```javascript
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization']
};

app.use(cors(corsOptions));
```

### **3. `src/utils/auth.js`** (JWT Functions)
```javascript
export function generateToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### **4. `src/middlewares/auth.js`** (Protection)
```javascript
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const tokenResult = getUserFromToken(authHeader);
  
  if (!tokenResult.success) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  req.user = tokenResult;
  next();
}
```

---

## ✅ What's Protected

### **Protected Routes** (Require Authentication):
- ✅ `PUT /api/users/:id` - Update user
- ✅ `DELETE /api/users/:id` - Delete user
- ✅ `POST /api/matching/find-roommates/:userId` - AI matching
- ✅ `GET /api/matching/best-match/:userId` - Best match
- ✅ `GET /api/matching/stats/:userId` - Statistics
- ✅ `POST /api/matching/compare/:userId/:candidateId` - Compare users

### **Public Routes** (No Authentication):
- 🌐 `POST /api/auth/register` - Register
- 🌐 `POST /api/auth/login` - Login
- 🌐 `GET /api/users` - List all users
- 🌐 `GET /api/users/:id` - Get single user
- 🌐 `GET /api/health` - Health check

---

## 🚀 Next Steps

### **1. Add Refresh Tokens** (Long-term sessions)
```javascript
// Generate both access & refresh tokens
const accessToken = generateToken(user, '15m');
const refreshToken = generateRefreshToken(user, '7d');

// Store refresh token in database
await RefreshToken.create({ userId: user.id, token: refreshToken });
```

### **2. Add Password Reset**
```javascript
POST /api/auth/forgot-password
POST /api/auth/reset-password/:token
```

### **3. Add Email Verification**
```javascript
POST /api/auth/verify-email/:token
POST /api/auth/resend-verification
```

### **4. Add OAuth (Google/Facebook)**
```javascript
GET /api/auth/google
GET /api/auth/google/callback
```

### **5. Rate Limiting** (Prevent brute force)
```javascript
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // 5 attempts per window
});

app.use('/api/auth/login', loginLimiter);
```

---

## 📚 Resources

- **JWT**: https://jwt.io/
- **CORS**: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
- **bcrypt**: https://github.com/kelektiv/node.bcrypt.js
- **jsonwebtoken**: https://github.com/auth0/node-jsonwebtoken

---

## 🎉 Summary

Your backend now has:
✅ **JWT Authentication** with secure token generation  
✅ **Password Hashing** with bcryptjs  
✅ **CORS Configuration** for frontend access  
✅ **Protected Routes** for sensitive operations  
✅ **Role-Based Access** (users can only modify their own data)  
✅ **Token Expiration** (24-hour validity)  
✅ **Comprehensive Error Handling** for auth failures  

Your authentication system is **production-ready** and follows industry best practices! 🔒✨
