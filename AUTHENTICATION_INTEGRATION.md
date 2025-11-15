# 🔐 Authentication Integration - Lumiq

## ✅ Completed Integration

The frontend and backend authentication systems have been successfully connected!

### What Was Done

#### 1. **Environment Configuration**
- ✅ Created frontend `.env` file with correct API URL
- ✅ Backend running on: `http://localhost:3001`
- ✅ Frontend API calls go to: `http://localhost:3001/api`

#### 2. **API Service Layer** (`frontend/src/api/index.ts`)
- ✅ Created `authService` with login, register, and getCurrentUser functions
- ✅ Added JWT token interceptor to attach token to all authenticated requests
- ✅ Added response interceptor to handle 401 errors and redirect to login
- ✅ Token stored in localStorage and automatically sent with requests

#### 3. **Authentication Context** (`frontend/src/contexts/AuthContext.tsx`)
- ✅ Created React Context for managing authentication state
- ✅ Provides `user`, `token`, `login`, `register`, `logout` functions
- ✅ Automatically loads user from localStorage on app startup
- ✅ Manages token and user data persistently

#### 4. **Form Validators** (`frontend/src/lib/validators.ts`)
- ✅ Updated SignIn schema: minimum 6 characters (matches backend)
- ✅ Updated SignUp schema: changed `username` to `name` (matches backend)
- ✅ Simplified password requirements to match backend (6+ chars, no special requirements)
- ✅ Added password confirmation validation

#### 5. **Authentication Form** (`frontend/src/components/auth/auth-form.tsx`)
- ✅ Connected to `useAuth()` hook
- ✅ Calls actual API endpoints instead of mock data
- ✅ Shows success/error toasts using Sonner
- ✅ Navigates to home page on successful auth
- ✅ Proper error handling with user-friendly messages

#### 6. **Sign Up Page** (`frontend/src/pages/auth/sign-up-page.tsx`)
- ✅ Updated default values to use `name` instead of `username`

#### 7. **App Provider Setup** (`frontend/src/main.tsx`)
- ✅ Wrapped app with `AuthProvider` to enable auth context globally
- ✅ Proper provider hierarchy: QueryClient → Auth → Theme

---

## 🚀 How to Test

### Step 1: Start Backend Server

```bash
cd backend
npm run dev
```

**Expected output:**
```
✅ Database connected successfully
🚀 API running on http://localhost:3001
```

### Step 2: Start Frontend Server

```bash
cd frontend
npm run dev
```

**Expected output:**
```
VITE ready in X ms
➜ Local: http://localhost:5173
```

### Step 3: Test Sign Up Flow

1. Open browser to `http://localhost:5173`
2. Click "Sign up" or navigate to `/auth/sign-up`
3. Fill in the form:
   - **Name**: John Doe
   - **Email**: john@example.com
   - **Password**: password123
   - **Confirm Password**: password123
4. Click "Sign Up"
5. Should see success toast and redirect to home page
6. Check browser localStorage for `token` and `user` data

### Step 4: Test Sign In Flow

1. Navigate to `/auth/sign-in`
2. Fill in credentials:
   - **Email**: john@example.com
   - **Password**: password123
3. Click "Sign In"
4. Should see success toast and redirect to home page
5. Token should be stored in localStorage

### Step 5: Verify Token Storage

**Open Browser DevTools:**
1. Go to Application → Local Storage
2. Should see:
   - `token`: JWT string (eyJhbGciOiJIUzI1NiIsInR...)
   - `user`: JSON object with `{id, email, name, role}`

### Step 6: Test Protected API Calls

The JWT token is now automatically attached to all API requests. Test by:

1. Log in with valid credentials
2. Open Network tab in DevTools
3. Navigate to any page that makes API calls
4. Check request headers - should see:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR...
   ```

---

## 🔧 API Endpoints

### Authentication Endpoints

#### Register
```http
POST http://localhost:3001/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully.",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "role": "student"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login
```http
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful.",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "role": "student"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get Current User
```http
GET http://localhost:3001/api/auth/me
Authorization: Bearer <your-token-here>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "role": "student"
  }
}
```

---

## 📝 Frontend Usage

### Using Auth in Components

```tsx
import { useAuth } from '@/contexts/AuthContext'

export function MyComponent() {
  const { user, token, login, logout, isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>Please log in</div>
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Making Authenticated API Calls

```tsx
import api from '@/api'

// Token is automatically attached by interceptor
const fetchUserData = async () => {
  try {
    const response = await api.get('/users/me')
    console.log(response.data)
  } catch (error) {
    console.error('Error:', error)
  }
}
```

---

## 🔒 Security Features

### Token Management
- ✅ JWT tokens stored in localStorage
- ✅ Tokens automatically attached to all API requests
- ✅ Tokens expire after 24 hours (configurable in backend)
- ✅ Auto-redirect to login on 401 errors

### Password Security
- ✅ Passwords hashed with bcryptjs (10 salt rounds)
- ✅ Never sent or stored in plain text
- ✅ Minimum 6 characters required

### CORS Configuration
- ✅ Backend accepts requests from localhost:5173 and localhost:3000
- ✅ Credentials enabled for cookie/token support
- ✅ Proper headers exposed for authentication

---

## 🐛 Troubleshooting

### Issue: "Network Error" or CORS errors
**Solution:** Make sure backend is running on port 3001

### Issue: "Invalid credentials" on login
**Solution:** 
1. Check if user exists in database
2. Verify password is correct
3. Check backend logs for errors

### Issue: Token not being sent with requests
**Solution:**
1. Check localStorage has `token` key
2. Verify api interceptor is configured
3. Make sure you're using the `api` instance from `@/api`

### Issue: 401 Unauthorized on protected routes
**Solution:**
1. Verify user is logged in
2. Check token hasn't expired
3. Ensure token is being sent in Authorization header

---

## 📊 Backend Requirements

### Environment Variables (.env)
```bash
# Required for auth to work
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lumiq
PORT=3001
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
```

### Database
- MongoDB Atlas connection required
- Users collection must exist
- Backend auto-creates collections on first use

---

## ✨ Next Steps

Now that authentication is working, you can:

1. **Protect Routes**: Add auth checks to prevent unauthenticated access
2. **Add Logout**: Implement logout button in navbar
3. **User Profile**: Fetch and display user data
4. **Persist Auth**: Auto-login users on page refresh (already implemented!)
5. **Connect Other APIs**: Use the same pattern for dorms, rooms, etc.

---

## 📦 Files Modified/Created

### Created:
- `frontend/.env`
- `frontend/src/contexts/AuthContext.tsx`
- `AUTHENTICATION_INTEGRATION.md` (this file)

### Modified:
- `frontend/src/api/index.ts` - Added authService and interceptors
- `frontend/src/components/auth/auth-form.tsx` - Connected to real API
- `frontend/src/lib/validators.ts` - Updated schemas
- `frontend/src/pages/auth/sign-up-page.tsx` - Changed username to name
- `frontend/src/main.tsx` - Added AuthProvider

---

## 🎉 Summary

**Authentication is now fully functional!** 

The frontend React app can:
- ✅ Register new users
- ✅ Login existing users
- ✅ Store JWT tokens
- ✅ Automatically attach tokens to API requests
- ✅ Handle authentication errors
- ✅ Persist login state across page refreshes

The integration uses simple, clean code that's easy to maintain and extend.
