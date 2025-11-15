# ⚙️ Configuration Required - Lumiq Setup

## 🚨 Important: Backend Configuration Needed

Before testing the authentication integration, you need to configure your backend `.env` file with real values.

## 📝 Backend .env Configuration

**Location:** `/backend/.env`

### Required Values to Update:

#### 1. MongoDB Connection (REQUIRED)
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

**How to get this:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign in or create a free account
3. Create a cluster (free tier available)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<username>`, `<password>`, and `<database>` with your values

**Example:**
```bash
MONGODB_URI=mongodb+srv://lumiquser:MySecurePass123@cluster0.abc123.mongodb.net/lumiq?retryWrites=true&w=majority
```

#### 2. JWT Secret (REQUIRED for Security)
```bash
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Generate a secure secret:**
```bash
# Run this command in your terminal:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

This will output something like:
```
a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456789012345678901234567890abcdef123456789012345678901234567890
```

Copy and paste this as your `JWT_SECRET`.

#### 3. Groq API Key (OPTIONAL - for AI matching)
```bash
GROQ_API_KEY=your-groq-api-key-here
```

**Not required for authentication**, but needed for AI roommate matching feature.

**How to get this:**
1. Go to [Groq Console](https://console.groq.com/keys)
2. Sign up for free account
3. Create a new API key
4. Copy and paste into .env

---

## ✅ Final .env File Example

Your `/backend/.env` should look like this (with real values):

```bash
# MongoDB Configuration
NODE_ENV=development

# MongoDB Connection String (Atlas) - UPDATE THIS!
MONGODB_URI=mongodb+srv://lumiquser:SecurePass123@cluster0.abc123.mongodb.net/lumiq?retryWrites=true&w=majority

# Server Configuration - DO NOT CHANGE
PORT=3001
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# JWT Authentication - UPDATE THIS!
JWT_SECRET=a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456789012345678901234567890abcdef
JWT_EXPIRES_IN=24h

# Groq AI Configuration (Optional for now)
GROQ_API_KEY=gsk_your_actual_key_here_if_you_have_one
```

---

## 🚀 Quick Start After Configuration

### 1. Start Backend
```bash
cd backend
npm install  # If you haven't already
npm run dev
```

**Expected output:**
```
✅ Database connected successfully
🚀 API running on http://localhost:3001
```

If you see `❌ Database connection failed`, your MongoDB URI is incorrect.

### 2. Start Frontend
```bash
cd frontend
npm install  # If you haven't already
npm run dev
```

**Expected output:**
```
VITE ready in XXX ms
➜ Local: http://localhost:5173
```

### 3. Test Integration

**Option A: Automated Test**
```bash
./test-auth-integration.sh
```

**Option B: Manual Browser Test**
1. Open http://localhost:5173
2. Click "Sign up"
3. Create an account
4. Should redirect to home page
5. Check browser DevTools → Application → Local Storage for `token`

---

## 🐛 Troubleshooting

### Error: "Database connection failed"
**Problem:** MongoDB URI is incorrect or database is unreachable

**Solutions:**
1. Check MongoDB Atlas dashboard - is your cluster running?
2. Verify connection string format
3. Make sure your IP address is whitelisted in MongoDB Atlas
4. Try connecting with MongoDB Compass to verify credentials

### Error: "CORS policy blocked"
**Problem:** Frontend can't reach backend

**Solutions:**
1. Make sure backend is running on port 3001
2. Check `CORS_ORIGIN` in backend .env includes `http://localhost:5173`
3. Restart backend after changing .env

### Error: "Network Error" in browser
**Problem:** Backend is not running or wrong port

**Solutions:**
1. Check if backend is running: `curl http://localhost:3001/test`
2. Look at backend terminal for errors
3. Make sure PORT=3001 in backend .env

### Error: "Invalid token" or auth issues
**Problem:** JWT secret mismatch or expired token

**Solutions:**
1. Generate a new strong JWT_SECRET
2. Restart backend after changing JWT_SECRET
3. Clear browser localStorage and login again

---

## 📊 Ports Configuration

| Service | Port | URL |
|---------|------|-----|
| Backend API | 3001 | http://localhost:3001 |
| Frontend Dev Server | 5173 | http://localhost:5173 |
| MongoDB Atlas | Remote | Connection string |

**Important:** The frontend is configured to call the backend at `http://localhost:3001/api`. This is already set up in `/frontend/.env`:

```bash
VITE_API_URL=http://localhost:3001/api
```

No need to change this!

---

## 📁 Files to Configure

### Must Configure:
- ✅ `/backend/.env` - MongoDB URI and JWT Secret

### Already Configured (No changes needed):
- ✅ `/frontend/.env` - API URL already set
- ✅ `/frontend/src/api/index.ts` - API configuration done
- ✅ `/frontend/src/contexts/AuthContext.tsx` - Auth context ready
- ✅ All authentication components and pages

---

## 🎯 Summary

1. **Update `/backend/.env`** with your MongoDB connection string
2. **Generate and set a secure JWT_SECRET**
3. **Start both servers** (backend first, then frontend)
4. **Test authentication** in browser or with script
5. **If errors occur**, check troubleshooting section above

Once configured, authentication will work seamlessly between frontend and backend! 🎉
