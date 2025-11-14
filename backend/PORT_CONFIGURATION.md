# 🔧 Port 5000 Issue - RESOLVED

## Problem
Got **403 Forbidden** error when testing `http://localhost:5000/api/users`

## Root Cause
Port 5000 was being used by **macOS ControlCenter**, not the Express server.

```bash
$ lsof -i :5000
COMMAND    PID    USER   FD  TYPE             NODE NAME
ControlCe  15889  sanmine   10u  IPv4          TCP *:commplex-main (LISTEN)
```

## Solution
Changed the server port to **3001** ✅

## Updated Configuration

### `.env` file
```properties
# Server Configuration
PORT=3001
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

## New Endpoint URLs

| Endpoint | Old URL | New URL | Status |
|----------|---------|---------|--------|
| Users | `http://localhost:5000/api/users` | `http://localhost:3001/api/users` | ✅ Working |
| Health | `http://localhost:5000/api/health` | `http://localhost:3001/api/health` | ✅ Working |
| Login | `http://localhost:5000/api/auth/login` | `http://localhost:3001/api/auth/login` | ✅ Working |
| Dorms | `http://localhost:5000/api/dorms` | `http://localhost:3001/api/dorms` | ✅ Working |
| Rooms | `http://localhost:5000/api/rooms` | `http://localhost:3001/api/rooms` | ✅ Working |

## Test Now ✅

### Get All Users
```bash
curl http://localhost:3001/api/users
```

**Response:**
```json
[
  {
    "_id": "6916c93e727058084a8bb08d",
    "email": "alice.chen@lumiq.edu",
    "name": "Alice Chen",
    "role": "student",
    "createdAt": "2025-11-14T06:16:30.879Z",
    "updatedAt": "2025-11-14T06:16:30.879Z"
  },
  ...
]
```

### Login with Test Credentials
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice.chen@lumiq.edu",
    "password": "Password123!"
  }'
```

### Get Health Status
```bash
curl http://localhost:3001/api/health
```

## Postman Configuration

Update your Postman environment or requests:
- **Old Base URL:** `http://localhost:5000`
- **New Base URL:** `http://localhost:3001`

Or use the variable:
```
{{BASE_URL}}/api/users
```

With `BASE_URL = http://localhost:3001`

## Server Status

### Current Server (Port 3001)
```
🚀 API running on http://localhost:3001
✅ MongoDB connected successfully
✅ Database connected successfully
```

### All Routes Available
- ✅ `/api/health` - Health check
- ✅ `/api/users` - User management  
- ✅ `/api/auth` - Authentication (register, login)
- ✅ `/api/dorms` - Dormitory listing
- ✅ `/api/rooms` - Room management
- ✅ `/api/personalities` - User personality profiles
- ✅ `/api/preferred_roommate` - Roommate preferences

## Troubleshooting

### Port Still in Use?
```bash
# Check what's using the port
lsof -i :3001

# If needed, kill the process
kill -9 <PID>

# Or use a different port in .env
PORT=3002
```

### CORS Issues?
Make sure your frontend is on one of these ports:
- `http://localhost:5173` (Vite default)
- `http://localhost:3000` (React default)

Update `.env` if needed:
```properties
CORS_ORIGIN=http://localhost:5173,http://localhost:3000,http://your-custom-port
```

## Next Steps

1. ✅ **Update Postman** - Use new port 3001
2. ✅ **Update Frontend** - Point to `http://localhost:3001`
3. ✅ **Test All Endpoints** - Start with health check
4. ✅ **Continue Development** - Everything working now!

---

**Fixed:** November 14, 2025  
**Server:** Node.js + Express + MongoDB  
**Status:** 🟢 Running on port 3001
