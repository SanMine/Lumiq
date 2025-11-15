# 📚 Lumiq Backend - Complete Documentation

> **Last Updated:** November 14, 2025  
> **Version:** 2.0 (MongoDB + Mongoose + JWT + AI Matching)

---

## 📑 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Database Structure](#database-structure)
4. [Authentication & Security](#authentication--security)
5. [AI Roommate Matching](#ai-roommate-matching)
6. [API Endpoints](#api-endpoints)
7. [Setup & Installation](#setup--installation)
8. [Migration History](#migration-history)

---

## 🎯 Project Overview

**Lumiq** is a dormitory management and roommate matching system for Thai universities. It helps students find compatible roommates using AI-powered personality matching.

### Key Features
- ✅ User authentication with JWT
- ✅ Dorm listings and room management
- ✅ AI-powered roommate matching using Groq (LLaMA 3.1)
- ✅ Personality-based compatibility scoring
- ✅ Rating system for dorms
- ✅ Preferred roommate selection

---

## 🛠 Technology Stack

### Backend
- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **ODM:** Mongoose 8.x
- **Authentication:** JWT (jsonwebtoken) + bcryptjs
- **AI Engine:** Groq SDK (llama-3.1-8b-instant)

### Frontend
- **Framework:** React 19.1.1 with TypeScript
- **UI Library:** Shadcn/ui + Tailwind CSS 4.x
- **Routing:** React Router 7.8
- **Forms:** React Hook Form + Zod validation
- **Port:** 3000 (proxies to backend on 3001)

### Development Tools
- **Environment:** dotenv
- **CORS:** Configured for localhost:3000 & 5173
- **API Testing:** Postman collection available

---

## 🗄 Database Structure

### Collections (7 total)

#### 1. **Users** Collection
```javascript
{
  id: Number (unique, auto-increment),
  email: String (unique, required),
  name: String (required),
  passwordHash: String (auto-hashed),
  role: String (default: "student"),
  about: String,
  phone: String,
  profilePicture: String (URL),
  createdAt: Date,
  updatedAt: Date
}
```

**Methods:**
- `comparePassword(password)` - Verify password
- `hashPassword(password)` - Hash password
- `findByEmailWithPassword(email)` - Get user with password field

#### 2. **Dorms** Collection
```javascript
{
  id: Number (unique),
  name: String (required),
  location: String,
  description: String,
  rating: Number (0-5),
  facilities: [String],
  fees: {
    monthly_rent: Number,
    deposit: Number,
    water: Number,
    electricity_per_unit: Number
  },
  images: [String],
  contact: {
    phone: String,
    email: String
  }
}
```

#### 3. **Rooms** Collection
```javascript
{
  id: Number (unique),
  dormId: Number (ref: Dorms),
  room_number: String (required),
  floor: Number,
  capacity: Number (1 or 2),
  current_occupancy: Number (0-2),
  current_resident_id: Number (ref: Users),
  status: String (available/occupied/maintenance),
  amenities: [String],
  images: [String]
}
```

**Indexes:**
- Compound unique: `dormId` + `room_number`

#### 4. **Ratings** Collection
```javascript
{
  id: Number (unique),
  userId: Number (ref: Users),
  dormId: Number (ref: Dorms),
  rating: Number (1-5, required),
  comment: String,
  createdAt: Date
}
```

**Indexes:**
- Compound unique: `userId` + `dormId` (one rating per user per dorm)

#### 5. **User_personalities** Collection
```javascript
{
  id: Number (unique),
  userId: Number (ref: Users, unique),
  cleanliness_level: String (very_clean/clean/moderate/messy),
  noise_tolerance: String (silent/quiet/moderate/noisy),
  sleep_schedule: String (early_bird/regular/night_owl/irregular),
  guest_frequency: String (never/rarely/sometimes/often),
  study_habit: String (library/room_silent/room_music/flexible),
  shared_item_comfort: String (everything/most/some/personal_only),
  temperature_preference: String (cold/cool/moderate/warm/hot),
  smoking: Boolean,
  pets: Boolean,
  social_preference: String (very_social/social/moderate/private/very_private),
  interests: [String],
  major: String,
  year: String
}
```

#### 6. **Preferred_roommates** Collection
```javascript
{
  id: Number (unique),
  userId: Number (ref: Users),
  preferredUserId: Number (ref: Users),
  status: String (pending/accepted/rejected),
  createdAt: Date
}
```

**Indexes:**
- Compound unique: `userId` + `preferredUserId`

#### 7. **Associations** Collection
```javascript
{
  id: Number (unique),
  user1Id: Number (ref: Users),
  user2Id: Number (ref: Users),
  compatibility_score: Number (0-100),
  status: String (matched/pending/dissolved),
  createdAt: Date,
  matchedAt: Date
}
```

---

## 🔐 Authentication & Security

### JWT Configuration

**Environment Variables (.env):**
```bash
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
MONGODB_URI=mongodb+srv://username:password@cluster0.c2dzvjk.mongodb.net/lumiq
PORT=3001
GROQ_API_KEY=your-groq-api-key-here
```

### CORS Settings
```javascript
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || [
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization']
};
```

### Protected Routes
All routes require `Authorization: Bearer <token>` header except:
- POST `/api/auth/register`
- POST `/api/auth/login`

### Password Security
- **Hashing:** bcryptjs with 10 salt rounds
- **Storage:** Only hashed passwords stored in database
- **Auto-hashing:** Passwords automatically hashed on User.save()

---

## 🤖 AI Roommate Matching

### Overview
Uses **Groq's LLaMA 3.1 8B Instant** model for intelligent roommate matching based on personality traits.

### How It Works

**1. Personality Analysis**
- Collects 13 personality attributes per user
- Compares cleanliness, noise tolerance, sleep schedule, etc.
- Considers interests, major, and year of study

**2. AI Scoring**
- Temperature: 0.6 (balanced creativity/consistency)
- Max tokens: 1500
- JSON response format
- Returns compatibility scores (0-100)

**3. Matching Algorithm**
```
1. Fetch user's personality profile
2. Find all users with complete personality data
3. Send personality pairs to Groq AI
4. AI analyzes compatibility across dimensions
5. Returns sorted matches with scores & explanations
```

### Matching Endpoints

#### Find Roommates
```bash
POST /api/matching/find-roommates/:userId
Authorization: Bearer <token>

Response:
{
  "user": { id, name, personality },
  "matches": [
    {
      "user": { id, name, email },
      "score": 85,
      "explanation": "AI analysis of compatibility"
    }
  ]
}
```

#### Get Best Match
```bash
GET /api/matching/best-match/:userId
Authorization: Bearer <token>

Response:
{
  "user": { id, name },
  "bestMatch": {
    "user": { id, name, email },
    "score": 92,
    "explanation": "Detailed compatibility analysis"
  }
}
```

#### Analyze Two Users
```bash
POST /api/matching/analyze-compatibility
Authorization: Bearer <token>
Body: { "userId1": 1, "userId2": 2 }

Response:
{
  "user1": { id, name },
  "user2": { id, name },
  "compatibility": {
    "score": 78,
    "explanation": "Compatibility breakdown"
  }
}
```

#### Generate Match Explanation
```bash
POST /api/matching/explain-match/:userId
Authorization: Bearer <token>
Body: { "matchUserId": 2 }

Response:
{
  "user": { id, name },
  "matchUser": { id, name },
  "explanation": "Why these users are compatible"
}
```

### AI Prompt Template
```javascript
You are a roommate matching expert. Analyze these two users:

User 1: ${JSON.stringify(user1Personality)}
User 2: ${JSON.stringify(user2Personality)}

Rate compatibility (0-100) and explain why.
Focus on: cleanliness, sleep schedule, noise tolerance, social habits.
Return JSON: { "score": number, "explanation": string }
```

---

## 🌐 API Endpoints

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | No | Register new user |
| POST | `/login` | No | Login and get JWT token |

**Register Request:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "SecurePass123!"
}
```

**Login Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### User Routes (`/api/users`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | No | Get all users |
| GET | `/:id` | No | Get user by ID |
| PUT | `/:id` | Yes | Update user (own profile only) |
| DELETE | `/:id` | Yes | Delete user (own account only) |

### Dorm Routes (`/api/dorms`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | No | Get all dorms |
| GET | `/:id` | No | Get dorm by ID |
| POST | `/` | Yes | Create new dorm |
| PUT | `/:id` | Yes | Update dorm |
| DELETE | `/:id` | Yes | Delete dorm |

### Room Routes (`/api/rooms`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | No | Get all rooms |
| GET | `/:id` | No | Get room by ID |
| GET | `/dorm/:dormId` | No | Get rooms by dorm |
| POST | `/` | Yes | Create new room |
| PUT | `/:id` | Yes | Update room |

### Personality Routes (`/api/personalities`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/:userId` | No | Get user personality |
| POST | `/` | Yes | Create personality profile |
| PUT | `/:userId` | Yes | Update personality |

### Matching Routes (`/api/matching`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/find-roommates/:userId` | Yes | Find all compatible matches |
| GET | `/best-match/:userId` | Yes | Get single best match |
| POST | `/analyze-compatibility` | Yes | Compare two specific users |
| POST | `/explain-match/:userId` | Yes | Get detailed match explanation |

### Preferred Roommate Routes (`/api/preferred-roommate`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/user/:userId` | No | Get user's preferred roommates |
| POST | `/` | Yes | Add preferred roommate |
| PUT | `/:id` | Yes | Update preference status |
| DELETE | `/:id` | Yes | Remove preference |

### Health Check (`/api/health`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | No | Check server status |

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 20+
- MongoDB Atlas account (or local MongoDB)
- Groq API key (https://console.groq.com)

### Backend Setup

**1. Install Dependencies**
```bash
cd backend
npm install
```

**2. Configure Environment**
Create `.env` file in backend root:
```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lumiq

# Server
PORT=3001
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# AI Matching
GROQ_API_KEY=gsk_your_groq_api_key_here
```

**3. Start Server**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server runs on: http://localhost:3001

### Frontend Setup

**1. Install Dependencies**
```bash
cd frontend
npm install
```

**2. Start Development Server**
```bash
npm run dev
```

Frontend runs on: http://localhost:3000
- Automatically proxies `/api` requests to backend on port 3001

### Testing Authentication

**Quick Test Script:**
```bash
cd backend
./quick-auth-test.sh
```

**Manual Testing:**
```bash
# 1. Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice.chen@lumiq.edu","password":"Password123!"}'

# 2. Use token
TOKEN="your_token_here"
curl -X GET http://localhost:3001/api/users \
  -H "Authorization: Bearer $TOKEN"
```

### Testing AI Matching

**Prerequisites:**
1. Users must have personality profiles
2. Must be authenticated (have JWT token)

**Example:**
```bash
# Get token
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice.chen@lumiq.edu","password":"Password123!"}' \
  | jq -r '.token')

# Find roommates
curl -X POST http://localhost:3001/api/matching/find-roommates/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

# Get best match
curl -X GET http://localhost:3001/api/matching/best-match/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📜 Migration History

### Phase 1: MySQL → MongoDB (Completed)
**Date:** November 2025

**Changes:**
- Migrated from MySQL + Sequelize to MongoDB + Mongoose
- Removed dependencies: `mysql2`, `sequelize`, `sequelize-cli`, `sqlite3`
- Added dependencies: `mongoose@^8.0.0`
- Converted all 7 models to Mongoose schemas
- Implemented numeric ID system (simulating MySQL auto-increment)
- Updated all routes to use Mongoose methods

**Files Removed:**
- `backend/sequelize.js`
- `backend/config/config.cjs`
- `backend/migrations/*`
- `backend/models/user.js` (old Sequelize model)
- `.sequelizerc`
- `database.sqlite`

### Phase 2: JWT Authentication (Completed)
**Date:** November 2025

**Changes:**
- Implemented JWT authentication with bcryptjs
- Added `JWT_SECRET` to environment variables
- Protected user update/delete routes
- Enhanced CORS configuration for credentials
- Added auth middleware (`requireAuth`)
- Created comprehensive test suites

**New Files:**
- `backend/src/middlewares/auth.js`
- `backend/src/utils/auth.js`
- `backend/AUTHENTICATION_GUIDE.md`
- `backend/quick-auth-test.sh`
- `backend/test-authentication.sh`

### Phase 3: AI Matching System (Completed)
**Date:** November 2025

**Changes:**
- Integrated Groq SDK for AI-powered matching
- Implemented 4 matching endpoints
- Created personality-based matching algorithm
- Added compatibility scoring (0-100)
- Protected matching routes with authentication

**Dependencies Added:**
- `groq-sdk@^0.8.0`

**New Files:**
- `backend/src/routes/matching.js` (4 endpoints)
- `backend/MATCHING_QUICKSTART.md`
- `backend/MATCHING_API.md`
- `backend/test-matching.sh`

### Phase 4: Frontend Migration (Completed)
**Date:** November 14, 2025

**Changes:**
- Merged TypeScript frontend from girls branch
- Removed old JavaScript frontend files
- Updated to React 19.1.1 with TypeScript
- Integrated Shadcn/ui component library
- Configured Vite for port 3000 with API proxy

**Files Removed:**
- `frontend/src/App.jsx`
- `frontend/src/Personality.jsx`
- `frontend/src/Properties.jsx`
- `frontend/src/Rooms.jsx`
- `frontend/src/main.jsx`
- `frontend/src/App.css`
- `frontend/src/index.css`

**Files Added:**
- 60+ TypeScript component files
- Shadcn/ui components
- Authentication pages
- Roommate matching forms
- `frontend/vite.config.ts`

---

## 🔍 Quick Reference

### Common Commands
```bash
# Backend
cd backend
npm install          # Install dependencies
npm run dev          # Start dev server
npm start            # Start production server
npm test             # Run tests (if configured)

# Frontend
cd frontend
npm install          # Install dependencies
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Database
# No commands needed - MongoDB Atlas handles everything
```

### Environment Variables
```bash
# Backend (.env)
MONGODB_URI=         # MongoDB connection string
PORT=3001            # Backend port
JWT_SECRET=          # JWT secret key (32+ chars)
GROQ_API_KEY=        # Groq API key for AI matching
CORS_ORIGIN=         # Comma-separated allowed origins
```

### Important Ports
- **Backend:** 3001
- **Frontend:** 3000
- **MongoDB:** Atlas (cloud) - no local port

### Git Branches
- **main:** Production-ready code
- **franco:** Current development branch (AI matching + TypeScript frontend)
- **girls:** TypeScript frontend source (merged into franco)

---

## 📞 Support & Resources

### External Documentation
- **MongoDB:** https://docs.mongodb.com/manual/
- **Mongoose:** https://mongoosejs.com/docs/
- **Express:** https://expressjs.com/
- **JWT:** https://jwt.io/introduction
- **Groq:** https://console.groq.com/docs
- **React:** https://react.dev/
- **Shadcn/ui:** https://ui.shadcn.com/

### API Testing
- Postman collection available (check `POSTMAN_GUIDE.md`)
- Test scripts in backend root:
  - `quick-auth-test.sh` - Authentication tests
  - `test-authentication.sh` - Comprehensive auth tests
  - `test-matching.sh` - AI matching tests

### Known Issues
- None currently reported

---

**Generated:** November 14, 2025  
**Version:** 2.0  
**Maintainer:** Franco (SanMine)  
**Repository:** https://github.com/SanMine/Lumiq
