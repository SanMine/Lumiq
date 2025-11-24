# LUMIQ - Smart Dormitory and Roommate Matching Platform

## Executive Summary

The search for suitable accommodation and compatible roommates often presents significant challenges, particularly for students and individuals relocating to new areas. Traditional methods for finding dormitories and roommates are frequently inefficient, time-consuming, and lack the necessary tools for informed decision-making. These methods typically involve manual searches, word-of-mouth recommendations, or generic online listings that do not adequately address the nuanced requirements of tenants, especially regarding roommate compatibility. The lack of structured information and personalized matching services often leads to dissatisfaction and conflicts among co-habitants, impacting their academic performance or overall well-being.

In response to these challenges, the Lumiq project proposes a comprehensive digital solution. Lumiq is a web application designed to revolutionize dormitory search and roommate matching experience. It integrates advanced search functionalities for dormitories with a sophisticated, AI-powered personality-based roommate matching system. The platform is structured with distinct client-side and administration-side functionalities to cater to the diverse needs of its users.

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Security & RBAC](#security--rbac)
- [Testing](#testing)
- [Deployment](#deployment)

---

## Project Overview

### Problem Statement

Students and young professionals face significant challenges when searching for accommodation:
- **Time-consuming manual searches** across multiple platforms
- **Lack of roommate compatibility information** leading to conflicts
- **Insufficient dormitory details** making informed decisions difficult
- **No centralized platform** for both dorm search and roommate matching

### Solution

LUMIQ provides a unified platform that combines:
1. **Comprehensive Dorm Search** - Detailed listings with photos, amenities, and pricing
2. **AI-Powered Roommate Matching** - Personality-based compatibility assessment
3. **Knock-Knock System** - Social connection feature for potential roommates
4. **Real-time Notifications** - Instant updates on bookings, knocks, and matches
5. **Admin Dashboard** - Complete dorm management for property owners

---

## Key Features

### For Students

#### 🏠 Dorm Search
- Advanced filtering (price, location, amenities)
- Detailed dorm profiles with images
- Room availability tracking
- Wishlist functionality
- Rating and review system

#### 👥 Roommate Matching
- **Personality Profile System**
  - MBTI personality type
  - Sleep schedule preferences
  - Cleanliness habits
  - Social preferences
  - Study habits
  - Lifestyle choices (smoking, drinking, pets)
- **AI-Powered Matching Algorithm**
  - GROQ-based personality analysis
  - Compatibility scoring
  - Detailed comparison view

#### 🚪 Knock-Knock Feature
- Send connection requests to potential roommates
- Accept/Reject incoming knocks
- View accepted connections
- Profile comparison for matches

#### 🔔 Real-time Notifications
- New knock notifications
- Knock acceptance alerts
- Booking confirmations
- 30-second auto-refresh

### For Dorm Administrators

#### 📊 Admin Dashboard
- **Overview Analytics**
  - Total revenue
  - Booking statistics
  - Occupancy rates
  - Revenue trends

#### 🏢 Dorm Management
- Create and edit dorm listings
- Upload multiple images
- Manage amenities and facilities
- Set pricing and policies

#### 🛏️ Room Management
- Add/edit/delete rooms
- Track room availability
- Manage reservations
- Move-in/move-out tracking

#### 📈 Analytics & Reporting
- Revenue trend analysis
- Booking trends
- Room occupancy stats
- Recent booking overview

#### 🔔 Notifications
- New booking alerts with student details
- Real-time notification system

---

## Technology Stack

### Frontend
```json
{
  "framework": "React 18 + TypeScript",
  "routing": "React Router v7",
  "styling": "Tailwind CSS",
  "ui-components": "shadcn/ui + Radix UI",
  "state": "React Context API",
  "http-client": "Axios",
  "build": "Vite",
  "package-manager": "pnpm"
}
```

### Backend
```json
{
  "runtime": "Node.js 18+",
  "framework": "Express.js 5",
  "database": "MongoDB + Mongoose",
  "auth": "JWT + bcryptjs",
  "ai": "GROQ SDK (Llama 3.3 70B)",
  "file-upload": "Multer",
  "cors": "CORS middleware"
}
```

---

## System Architecture

### Visual Architecture Diagram

![LUMIQ Architecture - 7-Layer Overview](architecture-diagram.png)

*Figure 1: Complete system architecture showing all 7 layers from client to database with data flow*

### High-Level Architecture Overview (Text Format)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                                   │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Web Browser (Chrome, Firefox, Safari, Edge)                      │  │
│  │  Port: 5173 (Development) / 80, 443 (Production)                  │  │
│  └───────────────────────────┬──────────────────────────────────────┘  │
└────────────────────────────────┼────────────────────────────────────────┘
                                 │
                          HTTPS/REST API
                          (JSON Payload)
                                 │
┌────────────────────────────────▼────────────────────────────────────────┐
│                        PRESENTATION LAYER                                │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │              React 18 + TypeScript Frontend                       │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌───────────┐  │  │
│  │  │   Pages    │  │ Components │  │  Contexts  │  │   Hooks   │  │  │
│  │  │            │  │            │  │            │  │           │  │  │
│  │  │ • Home     │  │ • Navbar   │  │ • Auth     │  │ • useAuth │  │  │
│  │  │ • Dorms    │  │ • Cards    │  │ • Theme    │  │ • useData │  │  │
│  │  │ • Rooms    │  │ • Forms    │  │            │  │           │  │  │
│  │  │ • Profile  │  │ • Modals   │  │            │  │           │  │  │
│  │  │ • Admin    │  │ • Notify   │  │            │  │           │  │  │
│  │  └────────────┘  └────────────┘  └────────────┘  └───────────┘  │  │
│  │                                                                    │  │
│  │  Routing: React Router v7 | State: Context API | Styling: Tailwind│  │
│  └────────────────────────────┬───────────────────────────────────────┘  │
└─────────────────────────────────┼────────────────────────────────────────┘
                                  │
                        Axios HTTP Client
                        (JWT Token Headers)
                                  │
┌─────────────────────────────────▼────────────────────────────────────────┐
│                         APPLICATION LAYER                                 │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │              Express.js Backend Server (Port 5001)                │   │
│  │                                                                    │   │
│  │  ┌──────────────────────────────────────────────────────────┐   │   │
│  │  │                    Middleware Stack                       │   │   │
│  │  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌──────────────┐  │   │   │
│  │  │  │  CORS  │→ │ Morgan │→ │  JSON  │→ │ Auth (JWT)   │  │   │   │
│  │  │  │        │  │ Logger │  │ Parser │  │ & RBAC       │  │   │   │
│  │  │  └────────┘  └────────┘  └────────┘  └──────────────┘  │   │   │
│  │  └──────────────────────────────────────────────────────────┘   │   │
│  │                                                                    │   │
│  │  ┌──────────────────────────────────────────────────────────┐   │   │
│  │  │                    API Routes (13 files)                  │   │   │
│  │  │                                                            │   │   │
│  │  │  ┌─────────────┬─────────────┬──────────────────────┐   │   │   │
│  │  │  │   PUBLIC    │  PROTECTED  │   ADMIN ONLY         │   │   │   │
│  │  │  │             │             │                      │   │   │   │
│  │  │  │ /auth       │ /users      │ /dorms (CUD)        │   │   │   │
│  │  │  │ • signup    │ • profile   │ /rooms (CUD)        │   │   │   │
│  │  │  │ • signin    │ • update    │ /analytics          │   │   │   │
│  │  │  │             │             │                      │   │   │   │
│  │  │  │ /dorms (R)  │ /bookings   │                      │   │   │   │
│  │  │  │ /health     │ /knocks     │                      │   │   │   │
│  │  │  │             │ /match      │                      │   │   │   │
│  │  │  │             │ /notify     │                      │   │   │   │
│  │  │  │             │ /wishlist   │                      │   │   │   │
│  │  │  │             │ /personal   │                      │   │   │   │
│  │  │  └─────────────┴─────────────┴──────────────────────┘   │   │   │
│  │  └──────────────────────────────────────────────────────────┘   │   │
│  └────────────────────────────┬──────────────────────────────────┘   │
└─────────────────────────────────┼──────────────────────────────────────┘
                                  │
┌─────────────────────────────────▼────────────────────────────────────────┐
│                         BUSINESS LOGIC LAYER                              │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                      Service Layer (3 files)                      │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │   │
│  │  │ AI Matching  │  │   Counter    │  │   Room Service       │  │   │
│  │  │   Service    │  │   Service    │  │                      │  │   │
│  │  │              │  │              │  │   • Reserve          │  │   │
│  │  │ • GROQ API   │  │ • Auto-Inc   │  │   • Move-in/out     │  │   │
│  │  │ • Llama 3.3  │  │ • ID Gen     │  │   • Availability    │  │   │
│  │  │ • Analysis   │  │              │  │                      │  │   │
│  │  └──────┬───────┘  └──────────────┘  └──────────────────────┘  │   │
│  └─────────┼──────────────────────────────────────────────────────┘   │
└────────────┼───────────────────────────────────────────────────────────┘
             │
┌────────────▼───────────────────────────────────────────────────────────┐
│                           DATA ACCESS LAYER                             │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │              Mongoose ODM (11 Models)                             │ │
│  │  ┌────────────┬────────────┬──────────────┬─────────────────┐   │ │
│  │  │    User    │    Dorm    │Personality   │   Knock         │   │ │
│  │  ├────────────┼────────────┼──────────────┼─────────────────┤   │ │
│  │  │    Room    │  Booking   │ Notification │   Wishlist      │   │ │
│  │  ├────────────┼────────────┼──────────────┼─────────────────┤   │ │
│  │  │   Counter  │ AiMatchRes │ PreferredRM  │                 │   │ │
│  │  └────────────┴────────────┴──────────────┴─────────────────┘   │ │
│  └────────────────────────────┬───────────────────────────────────┘ │
└─────────────────────────────────┼─────────────────────────────────────┘
                                  │
┌─────────────────────────────────▼─────────────────────────────────────┐
│                          DATABASE LAYER                                │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │                  MongoDB (NoSQL Database)                         ││
│  │                                                                    ││
│  │  Collections:                                                      ││
│  │  • users          • dorms         • rooms        • bookings       ││
│  │  • personalities  • knocks        • notifications• wishlists      ││
│  │  • aimatchresults • preferredroommates          • counters        ││
│  │                                                                    ││
│  │  Indexes: _id (primary), userId, dormId, email (unique)          ││
│  └──────────────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                        EXTERNAL SERVICES                                │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │                  GROQ AI API (Llama 3.3 70B)                      │ │
│  │                  • Personality Analysis                           │ │
│  │                  • Compatibility Scoring                          │ │
│  │                  • Natural Language Processing                    │ │
│  └──────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

### Component Interaction Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                      DATA FLOW ARCHITECTURE                             │
└────────────────────────────────────────────────────────────────────────┘

1. AUTHENTICATION FLOW
   ┌─────────┐    signup/signin    ┌──────────┐    validate    ┌────────┐
   │ Client  │ ──────────────────→ │ /auth    │ ─────────────→ │  User  │
   │ (React) │                      │  Route   │                 │  Model │
   └─────────┘                      └──────────┘                 └────────┘
        │                                │                            │
        │         ← JWT Token ←──────────┘                            │
        │                                                              │
        │         Store in LocalStorage & Axios Headers              │
        │                                                              │
        └──────────────── All Future Requests with JWT ──────────────┘

2. DORM SEARCH & BOOKING FLOW
   ┌─────────┐   GET /dorms   ┌──────────┐   Query   ┌──────┐
   │ Client  │ ──────────────→│  Dorms   │──────────→│Dorm  │
   │         │                 │  Route   │           │Model │
   └─────────┘                 └──────────┘           └──────┘
        │                           │                     │
        │                           │  Filter, Sort       │
        │         ← Dorm List ←─────┴─────────────────────┘
        │
        ▼
   Select Dorm → View Rooms → Book Room
        │                           │
        ▼                           ▼
   POST /bookings          Creates Booking
        │                           │
        ├──────────────────────────→│ Booking Model
        │                           │
        │                           ├→ Update Room Status
        │                           ├→ Update User.dormId
        │                           └→ Send Admin Notification
        │
        └────────← Booking Confirmed ←────────

3. ROOMMATE MATCHING FLOW
   ┌─────────┐  Create Profile  ┌──────────┐   Save   ┌────────────┐
   │ Client  │ ────────────────→│Personality│─────────→│Personality │
   │         │                   │  Route    │          │   Model    │
   └─────────┘                   └──────────┘          └────────────┘
        │
        ▼
   GET /matching/find-match/:userId
        │
        ▼
   ┌──────────┐     Fetch All      ┌────────────┐
   │ Matching │ ──────────────────→│Personality │
   │  Route   │     Personalities   │   Model    │
   └──────────┘                     └────────────┘
        │
        ▼
   Calculate Compatibility Score (0-100)
   Based on: Sleep, Study, Cleanliness, Social, etc.
        │
        ├──────────────────→ AI Analysis (Optional)
        │                    GROQ API Call
        │                    GET /matching/ai-analysis/:id1/:id2
        │
        ▼
   Return Sorted Matches
        │
        └────────→ Client Displays Match Cards

4. KNOCK-KNOCK CONNECTION FLOW
   User A                    Backend                   User B
   ┌─────┐                  ┌────────┐               ┌─────┐
   │  A  │ ─── Knock ─────→│ Knock  │               │  B  │
   │     │     POST /knocks │ Model  │               │     │
   └─────┘                  └────┬───┘               └─────┘
                                 │
                                 ├─→ Create Knock (status: pending)
                                 ├─→ Create Notification for B
                                 │
                                 ▼
                            User B sees knock
                                 │
                            ┌────┴────┐
                            │ Accept? │
                            └────┬────┘
                                 │
                      ┌──────────┴──────────┐
                      │                     │
                   Accept               Reject
                      │                     │
                      ▼                     ▼
              PUT /knocks/:id/accept   (Status: rejected)
                      │
                      ├─→ Update status: accepted
                      ├─→ Notify User A (accepted)
                      │
                      ▼
              Both users can view connection
              GET /connection/:userId

5. NOTIFICATION SYSTEM FLOW
   ┌──────────────┐
   │ Event Occurs │ (Knock, Booking, Match)
   └──────┬───────┘
          │
          ▼
   ┌────────────────┐
   │ Create         │ POST Internal
   │ Notification   │──────────────────┐
   └────────────────┘                  │
                                       ▼
                              ┌─────────────────┐
                              │  Notification   │
                              │     Model       │
                              └────────┬────────┘
                                       │
   ┌───────────────────────────────────┘
   │
   │  Client Polls (Every 30s)
   │  GET /notifications
   │
   ▼
┌─────────┐     ┌──────────────┐
│ Client  │←────│ Unread Count │
│ Updates │     │ + Messages   │
└─────────┘     └──────────────┘

6. ADMIN DASHBOARD FLOW
   ┌──────────┐   Login as Admin   ┌────────────┐
   │  Admin   │ ──────────────────→│ Auth       │
   │  Client  │                     │ Middleware │
   └──────────┘                     └─────┬──────┘
        │                                  │
        │                            Verify Role
        │                                  │
        │         ← JWT with admin role ←──┘
        │
        ▼
   Access Admin Routes
        │
        ├──→ GET /dorms/my          (My Dorms)
        ├──→ GET /rooms             (All Rooms)
        ├──→ GET /bookings          (All Bookings)
        ├──→ GET /analytics/*       (Dashboard Stats)
        │
        ▼
   Real-time Updates
        │
        └──→ GET /notifications (Booking Alerts)
```

### Security Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                                  │
└────────────────────────────────────────────────────────────────────┘

Layer 1: Transport Security
┌────────────────────────────────────────────────────────────────┐
│  • HTTPS (TLS 1.2+) in production                              │
│  • CORS configured with whitelist                              │
│  • Rate limiting (optional, recommended for production)        │
└────────────────────────────────────────────────────────────────┘

Layer 2: Authentication
┌────────────────────────────────────────────────────────────────┐
│  ┌───────────────┐       ┌──────────────┐                     │
│  │  JWT Tokens   │──────→│ Verification │                     │
│  │  (Bearer)     │       │  Middleware  │                     │
│  └───────────────┘       └──────────────┘                     │
│                                                                 │
│  • Token in Authorization: Bearer <token>                     │
│  • Secret key for signing                                     │
│  • Token expiration (configurable)                            │
└────────────────────────────────────────────────────────────────┘

Layer 3: Authorization (RBAC)
┌────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌─────────────┐    ┌──────────────┐    ┌────────────────┐   │
│  │  Student    │    │  Dorm Admin  │    │  System Admin  │   │
│  │             │    │              │    │                │   │
│  │ • View      │    │ All Student  │    │ All Permissions│   │
│  │ • Book      │    │   +          │    │                │   │
│  │ • Match     │    │ • Manage Own │    │ • Manage All   │   │
│  │ • Knock     │    │   Dorms      │    │ • Analytics    │   │
│  │             │    │ • Analytics  │    │ • User Mgmt    │   │
│  └─────────────┘    └──────────────┘    └────────────────┘   │
│                                                                 │
│  Middleware: requireAuth, requireStudent, requireDormAdmin    │
└────────────────────────────────────────────────────────────────┘

Layer 4: Data Security
┌────────────────────────────────────────────────────────────────┐
│  • Password Hashing (bcrypt, salt rounds: 10)                 │
│  • Input Sanitization (Mongoose validators)                   │
│  • SQL Injection Prevention (NoSQL, Mongoose)                 │
│  • XSS Prevention (React auto-escaping)                       │
└────────────────────────────────────────────────────────────────┘

Layer 5: Resource Access Control
┌────────────────────────────────────────────────────────────────┐
│  Check Ownership Before Modification:                          │
│  • User can update own profile only                           │
│  • Admin can manage own dorms only                            │
│  • Notifications belong to recipient                          │
│  • Bookings verified by user or admin                         │
└────────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
LUMIQ_Test/
├── frontend/
│   ├── src/
│   │   ├── admin-pages/      # Admin dashboard pages
│   │   │   ├── OverviewPage.tsx
│   │   │   ├── MyDormPage.tsx
│   │   │   ├── RoomsPage.tsx
│   │   │   ├── BookingsPage.tsx
│   │   │   ├── AnalyticsPage.tsx
│   │   │   └── SettingsPage.tsx
│   │   ├── components/       # Reusable components
│   │   │   ├── shared/       # Navbar, Footer, Notifications
│   │   │   └── ui/           # shadcn/ui components
│   │   ├── contexts/         # React contexts
│   │   │   └── AuthContext.tsx
│   │   ├── pages/           # Main application pages
│   │   │   ├── root/        # Student pages
│   │   │   │   ├── home-page.tsx
│   │   │   │   ├── all-dorms-page.tsx
│   │   │   │   ├── dorm-detail-page.tsx
│   │   │   │   ├── roommates-page.tsx
│   │   │   │   ├── knockknock-page.tsx
│   │   │   │   ├── connection-page.tsx
│   │   │   │   └── my-account-page.tsx
│   │   │   └── auth/        # Auth pages
│   │   ├── api/             # API client configuration
│   │   └── routes.tsx       # Route definitions
│   ├── package.json
│   └── pnpm-lock.yaml
│
├── backend/
│   ├── src/
│   │   ├── models/          # Mongoose models (11 files)
│   │   │   ├── User.js
│   │   │   ├── Dorm.js
│   │   │   ├── Room.js
│   │   │   ├── Booking.js
│   │   │   ├── Personality.js
│   │   │   ├── Knock.js
│   │   │   ├── Notification.js
│   │   │   ├── Wishlist.js
│   │   │   ├── AiMatchResult.js
│   │   │   ├── PreferredRoommate.js
│   │   │   └── Counter.js
│   │   ├── routes/          # API route controllers (13 files)
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   ├── dorms.js
│   │   │   ├── rooms.js
│   │   │   ├── bookings.js
│   │   │   ├── personalities.js
│   │   │   ├── matching.js
│   │   │   ├── knocks.js
│   │   │   ├── notifications.js
│   │   │   ├── wishlist.js
│   │   │   ├── analytics.js
│   │   │   ├── preferred_roommate.js
│   │   │   └── health.js
│   │   ├── middlewares/     # Auth & validation
│   │   │   └── auth.js      # JWT + RBAC
│   │   ├── services/        # Business logic (3 files)
│   │   │   ├── aiMatchingService.js
│   │   │   ├── counterService.js
│   │   │   └── roomService.js
│   │   └── index.js         # Server entry point
│   ├── uploads/            # File upload storage
│   ├── package.json
│   └── package-lock.json
│
└── README.md
```

---

## Installation & Setup

### Prerequisites

- Node.js 18+ and npm/pnpm
- MongoDB instance
- GROQ API key (for AI matching)

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=5001
MONGODB_URI=mongodb://localhost:27017/lumiq
JWT_SECRET=your_secure_jwt_secret_here_change_this
CORS_ORIGIN=http://localhost:5173
GROQ_API_KEY=your_groq_api_key_here
EOF

# Start development server
npm run dev
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
pnpm install

# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:5001/api
EOF

# Start development server
pnpm run dev
```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001/api
- **Health Check**: http://localhost:5001/api/health

---

## API Documentation

### Authentication Endpoints

#### POST /api/auth/signup
Register a new user

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "role": "student"  // or "dorm_admin"
}
```

#### POST /api/auth/signin
Authenticate user

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "student"
  }
}
```

### Dorm Endpoints

#### GET /api/dorms
Get all dorms (public)

**Query Parameters:**
- `search`: Search by name
- `minPrice`, `maxPrice`: Price range
- `facilities`: Filter by amenities

#### GET /api/dorms/:id
Get dorm details

#### POST /api/dorms
Create new dorm (Admin only)

**Requires**: `requireAuth`, `requireDormAdmin`

#### PUT /api/dorms/:id
Update dorm (Admin only)

#### DELETE /api/dorms/:id
Delete dorm (Admin only)

#### POST /api/dorms/:id/rate
Rate a dorm (Students only)

**Request Body:**
```json
{
  "rating": 4.5,
  "comment": "Great amenities!"
}
```

### Room Endpoints

#### GET /api/rooms
Get all rooms

#### POST /api/rooms
Create room (Admin only)

#### PUT /api/rooms/:id
Update room (Admin only)

#### POST /api/rooms/:id/reserve
Reserve room (Admin only)

### Personality Endpoints

#### GET /api/personalities?userId=:userId
Get user personality profile

#### POST /api/personalities
Create personality profile

**Request Body:**
```json
{
  "nickname": "John",
  "age": 22,
  "gender": "Male",
  "nationality": "Thai",
  "sleep_type": "Early Bird",
  "lifestyle": ["Active", "Social"],
  "study_habits": "Quiet Library",
  "cleanliness": "Very Clean",
  "social": "Extrovert",
  "MBTI": "ENFP",
  "going_out": "Frequently",
  "smoking": false,
  "drinking": "Occasionally",
  "pets": "Dogs",
  "noise_tolerance": "Medium",
  "temperature": "Cool"
}
```

### Matching Endpoints

#### GET /api/matching/find-match/:userId
Find compatible roommates

**Response:**
```json
{
  "matches": [
    {
      "user": { "_id": 2, "name": "Jane" },
      "compatibility": 85.5,
      "reasons": ["Similar sleep schedule", "Both prefer quiet study"]
    }
  ]
}
```

#### GET /api/matching/ai-analysis/:userId1/:userId2
Get AI-powered compatibility analysis

### Knock Endpoints

#### GET /api/knocks?userId=:userId
Get knocks for user

#### POST /api/knocks
Send a knock

**Request Body:**
```json
{
  "recipientId": 2
}
```

#### PUT /api/knocks/:id/accept
Accept a knock

### Notification Endpoints

#### GET /api/notifications
Get user notifications

#### PUT /api/notifications/:id/read
Mark notification as read

#### DELETE /api/notifications/:id
Delete notification

### Booking Endpoints

#### GET /api/bookings
Get bookings (All for admin, own for students)

#### POST /api/bookings
Create booking

**Request Body:**
```json
{
  "dormId": 1,
  "roomId": 101,
  "moveInDate": "2024-01-15",
  "stayDuration": 6,
  "durationType": "months",
  "paymentMethod": "card",
  "bookingFeePaid": 5000,
  "totalAmount": 30000
}
```

---

## Database Schema

### User Model
```javascript
{
  _id: Number (auto-increment),
  email: String (unique),
  password: String (hashed),
  name: String,
  role: String (enum: ["student", "dorm_admin", "admin"]),
  phone: String,
  dateOfBirth: Date,
  address: String,
  dormId: Number (ref to Dorm),
  createdAt: Date,
  updatedAt: Date
}
```

### Dorm Model
```javascript
{
  _id: Number,
  name: String,
  address: {
    addressLine1: String,
    subDistrict: String,
    district: String,
    province: String,
    zipCode: String,
    country: String
  },
  latitude: Number,
  longitude: Number,
  rating: Number (0-5),
  images: [String],
  description: String,
  facilities: [String],
  price: Number,
  admin_id: Number (ref to User),
  contact_gmail: String,
  contact_phone: String,
  Water_fee: Number,
  Electricity_fee: Number,
  isActive: Boolean
}
```

### Personality Model
```javascript
{
  _id: Number,
  userId: Number (ref to User),
  nickname: String,
  age: Number,
  gender: String,
  nationality: String,
  sleep_type: String,
  lifestyle: [String],
  study_habits: String,
  cleanliness: String,
  social: String,
  MBTI: String,
  going_out: String,
  smoking: Boolean,
  drinking: String,
  pets: String,
  noise_tolerance: String,
  temperature: String
}
```

### Knock Model
```javascript
{
  _id: Number,
  senderId: Number (ref to User),
  recipientId: Number (ref to User),
  status: String (enum: ["pending", "accepted", "rejected"]),
  createdAt: Date,
  updatedAt: Date
}
```

### Notification Model
```javascript
{
  _id: Number,
  recipientId: Number (ref to User),
  type: String (enum: ["knock", "match", "system", "message", "alert"]),
  title: String,
  message: String,
  read: Boolean,
  data: Mixed (additional context),
  createdAt: Date
}
```

---

## Security & RBAC

### Role-Based Access Control

The application implements comprehensive RBAC with three roles:

#### Student Role
- View dorms and rooms
- Create personality profile
- Send/receive knocks
- Book rooms
- Rate dorms
- Receive notifications

#### Dorm Admin Role
- All student permissions
- Create/edit/delete own dorms
- Manage rooms in own dorms
- View bookings for own dorms
- Access analytics dashboard
- Receive booking notifications

#### Admin Role (System Admin)
- Full access to all resources
- Manage all users
- System-wide analytics

### Authentication Middleware

```javascript
// requireAuth - Validates JWT token
// requireStudent - Ensures user is a student
// requireDormAdmin - Ensures user is a dorm admin
```

### Security Best Practices Implemented

1. **Password Security**
   - Bcrypt hashing with salt rounds
   - Minimum password requirements enforced

2. **JWT Authentication**
   - Secure token generation
   - Token expiration
   - HTTP-only cookies (recommended for production)

3. **CORS Configuration**
   - Whitelist specific origins
   - Credentials support

4. **Input Validation**
   - Mongoose schema validation
   - Required field enforcement
   - Type checking

5. **Authorization Checks**
   - Route-level RBAC
   - Resource ownership validation
   - Permission-based access

---

## Testing

### Manual Testing Checklist

#### Authentication
- [ ] User registration
- [ ] User login
- [ ] Token validation
- [ ] Logout functionality

#### Dorm Management
- [ ] View dorms list
- [ ] View dorm details
- [ ] Create dorm (admin)
- [ ] Update dorm (admin)
- [ ] Delete dorm (admin)
- [ ] Rate dorm (student)

#### Roommate Matching
- [ ] Create personality profile
- [ ] View matches
- [ ] AI compatibility analysis

#### Knock System
- [ ] Send knock
- [ ] Accept knock
- [ ] View knock list
- [ ] View connection

#### Notifications
- [ ] Receive knock notification
- [ ] Receive booking notification
- [ ] Mark as read
- [ ] Delete notification

#### Bookings
- [ ] Create booking
- [ ] View bookings
- [ ] Admin booking notification

---

## Deployment

### Production Checklist

#### Environment Variables
```bash
# Backend
PORT=5001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lumiq
JWT_SECRET=very_secure_random_string_change_in_production
CORS_ORIGIN=https://yourdomain.com
GROQ_API_KEY=your_production_groq_key

# Frontend
VITE_API_URL=https://api.yourdomain.com
```

#### Build for Production

**Frontend:**
```bash
cd frontend
pnpm run build
# Output in: dist/
```

**Backend:**
```bash
cd backend
npm run start
```

#### Deployment Platforms

**Recommended Options:**
- **Frontend**: Vercel, Netlify, Cloudflare Pages
- **Backend**: Render, Railway, AWS EC2, DigitalOcean
- **Database**: MongoDB Atlas

---

## Project Statistics

- **Total Routes**: 13 route files
- **Backend Models**: 11 models
- **Frontend Pages**: 20+ pages
- **API Endpoints**: 50+ endpoints
- **Dependencies**: 
  - Backend: 8 production, 1 dev
  - Frontend: 25+ production dependencies

---

## Future Enhancements

1. **Real-time Chat** - WebSocket-based messaging between matched roommates
2. **Payment Integration** - Stripe/PayPal for online bookings
3. **Mobile App** - React Native version
4. **Enhanced AI** - More sophisticated matching algorithms
5. **Virtual Tours** - 360° dorm views
6. **Review Verification** - Verified resident reviews only
7. **Calendar Integration** - Move-in scheduling
8. **Multi-language Support** - Thai and English interfaces

---

## Contributors

This project was developed as part of an academic initiative to solve real-world accommodation challenges.

---

## License

This project is proprietary software developed for academic purposes.

---

## Support

For issues and questions:
- Create an issue in the repository
- Contact the development team

---

**Last Updated**: November 25, 2024  
**Version**: 1.0.0  
**Status**: Production Ready
