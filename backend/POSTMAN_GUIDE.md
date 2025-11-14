# 📮 Postman Test Guide - Lumiq API

## Base URL
```
http://localhost:3001
```

---

## Authentication Tests

### 1️⃣ Register New User
**Method:** `POST`  
**URL:** `http://localhost:3001/api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "newuser@example.com",
  "name": "New User",
  "password": "Password123!",
  "role": "student"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully.",
  "user": {
    "id": "...",
    "email": "newuser@example.com",
    "name": "New User",
    "role": "student"
  },
  "token": "eyJhbGc..."
}
```

---

### 2️⃣ Login
**Method:** `POST`  
**URL:** `http://localhost:3001/api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "alice.chen@lumiq.edu",
  "password": "Password123!"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Login successful.",
  "user": {
    "id": "6916c93e727058084a8bb08d",
    "email": "alice.chen@lumiq.edu",
    "name": "Alice Chen",
    "role": "student"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**⚠️ Save the token for authenticated requests!**

---

### 3️⃣ Get Current User Profile
**Method:** `GET`  
**URL:** `http://localhost:3001/api/auth/me`

**Headers:**
```
Authorization: Bearer {YOUR_TOKEN}
Content-Type: application/json
```

**Expected Response (200):**
```json
{
  "id": "6916c93e727058084a8bb08d",
  "email": "alice.chen@lumiq.edu",
  "name": "Alice Chen",
  "role": "student"
}
```

---

## User Management Tests

### 4️⃣ Get All Users
**Method:** `GET`  
**URL:** `http://localhost:3001/api/users`

**Expected Response (200):**
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

---

### 5️⃣ Get User by ID
**Method:** `GET`  
**URL:** `http://localhost:3001/api/users/6916c93e727058084a8bb08d`

**Expected Response (200):**
```json
{
  "_id": "6916c93e727058084a8bb08d",
  "email": "alice.chen@lumiq.edu",
  "name": "Alice Chen",
  "role": "student"
}
```

---

## Dorm Tests

### 6️⃣ Get All Dorms
**Method:** `GET`  
**URL:** `http://localhost:3001/api/dorms`

**Expected Response (200):**
```json
[
  {
    "_id": "...",
    "name": "Sunrise Heights Dormitory",
    "location": "Downtown District, Block 5",
    "rating": 4.5,
    "facilities": "WiFi, Cafeteria, Gym...",
    "Water_fee": 150,
    "Electricity_fee": 200,
    "availibility": true
  },
  ...
]
```

---

### 7️⃣ Get Dorm by ID
**Method:** `GET`  
**URL:** `http://localhost:3001/api/dorms/{DORM_ID}`

**Expected Response (200):**
```json
{
  "_id": "...",
  "name": "Sunrise Heights Dormitory",
  "location": "Downtown District, Block 5",
  "rating": 4.5,
  ...
}
```

---

### 8️⃣ Rate a Dorm
**Method:** `POST`  
**URL:** `http://localhost:3001/api/dorms/{DORM_ID}/rate`

**Headers:**
```
Authorization: Bearer {YOUR_TOKEN}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "rating": 5
}
```

**Expected Response (200 or 201):**
```json
{
  "_id": "...",
  "userId": "6916c93e727058084a8bb08d",
  "dormId": "...",
  "rating": 5,
  "createdAt": "2025-11-14T06:20:00.000Z"
}
```

---

## Room Tests

### 9️⃣ Get All Rooms
**Method:** `GET`  
**URL:** `http://localhost:3001/api/rooms`

**Expected Response (200):**
```json
[
  {
    "_id": "...",
    "room_number": "101",
    "room_type": "Double",
    "capacity": 2,
    "price_per_month": 1500,
    "status": "Available",
    "floor": 1,
    "dormId": "..."
  },
  ...
]
```

---

### 🔟 Get Rooms by Dorm
**Method:** `GET`  
**URL:** `http://localhost:3001/api/rooms?dormId={DORM_ID}`

**Expected Response (200):**
```json
[
  {
    "_id": "...",
    "room_number": "101",
    "dormId": "...",
    ...
  }
]
```

---

## User Personality Tests

### 1️⃣1️⃣ Get All Personalities
**Method:** `GET`  
**URL:** `http://localhost:3001/api/personalities`

**Expected Response (200):**
```json
[
  {
    "_id": "...",
    "userId": "6916c93e727058084a8bb08d",
    "nickname": "Alice",
    "age": 22,
    "gender": "Female",
    "MBTI": "ENFP",
    "sleep_type": "Night Owl",
    "cleanliness": "Tidy",
    ...
  }
]
```

---

### 1️⃣2️⃣ Create Personality Profile
**Method:** `POST`  
**URL:** `http://localhost:3001/api/personalities`

**Headers:**
```
Authorization: Bearer {YOUR_TOKEN}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "userId": "6916c93e727058084a8bb08d",
  "nickname": "Alice",
  "age": 22,
  "gender": "Female",
  "nationality": "Thai",
  "MBTI": "ENFP",
  "sleep_type": "Night Owl",
  "study_habits": "some_noise",
  "cleanliness": "Tidy",
  "social": "Social",
  "going_out": "Frequent",
  "smoking": false,
  "drinking": "Never",
  "pets": "Dog Person",
  "noise_tolerance": "Medium",
  "temperature": "Cool"
}
```

---

## Roommate Preferences Tests

### 1️⃣3️⃣ Get All Preferences
**Method:** `GET`  
**URL:** `http://localhost:3001/api/preferred_roommate`

**Expected Response (200):**
```json
[
  {
    "_id": "...",
    "userId": "6916c93e727058084a8bb08d",
    "preferred_age_range": {
      "min": 20,
      "max": 25
    },
    "preferred_gender": "Any",
    "preferred_MBTI": "ENFP",
    ...
  }
]
```

---

## Health Check

### 1️⃣4️⃣ Health Status
**Method:** `GET`  
**URL:** `http://localhost:3001/api/health`

**Expected Response (200):**
```json
{
  "ok": true,
  "db": "up",
  "now": "2025-11-14T06:24:00.000Z"
}
```

---

## Postman Environment Setup

### Create Environment Variable
In Postman, create a new environment called "Lumiq Local":

```json
{
  "name": "Lumiq Local",
  "values": [
    {
      "key": "BASE_URL",
      "value": "http://localhost:3001",
      "type": "string",
      "enabled": true
    },
    {
      "key": "TOKEN",
      "value": "",
      "type": "string",
      "enabled": true
    },
    {
      "key": "USER_ID",
      "value": "6916c93e727058084a8bb08d",
      "type": "string",
      "enabled": true
    },
    {
      "key": "DORM_ID",
      "value": "",
      "type": "string",
      "enabled": true
    }
  ]
}
```

### Use Variables in Requests
```
{{BASE_URL}}/api/users
{{BASE_URL}}/api/auth/login
Authorization: Bearer {{TOKEN}}
```

---

## Test Accounts

| Email | Password | Role |
|-------|----------|------|
| `alice.chen@lumiq.edu` | `Password123!` | student |
| `bob.smith@lumiq.edu` | `SecurePass456!` | student |
| `carol.johnson@lumiq.edu` | `MyPassword789!` | owner |
| `admin@lumiq.edu` | `AdminPass123!` | admin |

---

## Common Response Codes

| Code | Meaning |
|------|---------|
| **200** | Success (GET, PUT, DELETE) |
| **201** | Created (POST) |
| **400** | Bad Request (missing/invalid data) |
| **401** | Unauthorized (missing/invalid token) |
| **403** | Forbidden (insufficient permissions) |
| **404** | Not Found |
| **500** | Server Error |

---

## Tips

✅ **Save Token After Login** - Click on the response, select the token, use Postman's dynamic variables  
✅ **Use Environment Variables** - Swap between local/staging/production  
✅ **Set Pre-request Script** - Automatically include auth headers  
✅ **Collection Runner** - Test multiple endpoints in sequence  
✅ **API Documentation** - Use Postman's documentation feature to share

---

**Last Updated:** November 14, 2025  
**Server:** http://localhost:3001  
**Status:** ✅ All endpoints working
