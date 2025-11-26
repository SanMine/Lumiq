# LUMIQ - Smart Dormitory and Roommate Matching Platform

## Executive Summary

LUMIQ is a comprehensive web application that revolutionizes the dormitory search and roommate matching experience for students and young professionals. It combines advanced dorm search functionalities with AI-powered personality-based roommate matching, real-time chat, price calculation tools, and comprehensive admin management capabilities.

## Table of Contents

- [Project Overview](#project-overview)
- [Comprehensive Feature List](#comprehensive-feature-list)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Installation \u0026 Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [Security \u0026 RBAC](#security--rbac)

---

## Project Overview

### Problem Statement

Students face challenges finding compatible roommates and suitable dormitories:
- **Time-consuming searches** across fragmented platforms
- **Roommate incompatibility** leading to conflicts
- **Unclear pricing** and hidden costs
- **No communication** before room commitment
- **Poor property management** tools for dorm administrators

### Our Solution

LUMIQ provides an all-in-one platform with:
1. Advanced dorm search with comprehensive filters
2. AI-powered roommate compatibility matching
3. Real-time chat between matched users
4. Transparent price calculations and breakdowns
5. Professional admin dashboard for property management
6. Secure RBAC (Role-Based Access Control)

---

## Comprehensive Feature List

### 🎯 For Students / Tenants

#### 1. 🏠 Dorm Discovery \u0026 Search

**Dorm Browsing**
- Browse all available dorms with card-based layout
- High-quality image galleries for each property
- Real-time availability status
- Rating and review system with star ratings
- Location-based browsing

**Advanced Search \u0026 Filtering**
- Search by dorm name or location
- Price range slider filters
- Amenities/facilities filter
- Sort by: Price, Rating, Availability
- Real-time search results

**Dorm Details Page**
- Comprehensive dorm information
  - Name, location (full address with district, province)
  - Multiple property images
  - Amenity list (WiFi, AC, Parking, etc.)
  - Contact information (Email, Phone, LINE ID, Facebook)
  - Operating hours
- **Room Listings**
  - Available rooms by floor and type (Single, Double, Suite)
  - Room-specific pricing
  - Room amenities
  - Availability status
- **Location Services**
  - Interactive map integration
  - Geographic coordinates
  - Distance calculation from landmarks
- **Reviews \u0026 Ratings**
  - Aggregate rating display
  - Individual user reviews
  - Comment section

#### 2. 💰 Pricing \u0026 Booking Features

**Transparent Price Breakdown**
- Room price per month (clearly displayed)
- **Utility Fee Transparency**
  - Water fees with billing type indicator (฿X / month or ฿X / unit)
  - Electricity fees with billing type (฿X / month or ฿X / unit)
  - Smart estimation: Fixed estimates for per-unit billing (฿200 for water, ฿500 for electricity)
- Insurance policy (one-time deposit)
- Booking fee (reservation cost)

**Automated Price Calculation**
- **First Month Total Calculation**
  - Room price
  - Insurance (one-time)
  - Estimated utilities (water + electricity)
  - Minus: Booking fee (already paid)
  - **Auto-calculated total**
- **Following Months Calculation**
  - Room price + utilities
  - Clear monthly cost projection

**Room Booking System**
- Real-time booking form
- Auto-populated user information
- Move-in date selector
- Stay duration configuration (months/years)
- **Multiple Payment Methods**
  - Credit/Debit card
  - QR PromptPay with auto-generated QR code
  - Bank slip upload
- **Booking Confirmation**
  - Instant booking confirmation dialog
  - Unique booking ID generation
  - PDF invoice generation and download
  - Email confirmation (planned)

**Invoice System**
- Professional PDF invoice template
- Complete pricing breakdown
- Dorm and room details
- Contact information
- Booking date and ID
- Download functionality

#### 3. 👥 Roommate Matching System

**Personality Profile Creation**
- **Detailed personality questionnaire**:
  - Nickname \u0026 basic info (age, gender, nationality)
  - MBTI personality type
  - Sleep schedule (Early Bird, Night Owl, Flexible)
  - Study habits (Library, Dorm, Coffee Shop, Group Study)
  - Cleanliness level (Very Clean, Moderate, Relaxed)
  - Social preference (Introvert, Extrovert, Ambivert)
  - Going out frequency
  - Lifestyle choices (Smoking: Yes/No)
  - Drinking habits (Never, Occasionally, Socially, Regularly)
  - Pet preferences
  - Noise tolerance (Low, Medium, High)
  - Room temperature preference (Cool, Warm, No Preference)

**Compatibility Matching Algorithm**
- **Multi-factor scoring system** (0-100% compatibility)
  - Sleep schedule compatibility (20 points)
  - Study habits alignment (15 points)
  - Cleanliness match (15 points)
  - Social preference compatibility (15 points)
  - Lifestyle compatibility (smoking, drinking, pets) (20 points)
  - Noise tolerance (10 points)
  - Temperature preference (5 points)
- **Weighted scoring** based on importance
- Top matches sorted by score

**AI-Powered Analysis**
- **GROQ AI Integration** (Llama 3.3 70B)
- Deep personality analysis
- Natural language compatibility report
- Detailed reasoning for matches
- Potential conflict identification
- Conversation starter suggestions

**Match Discovery UI**
- Card-based match display
- **Compatibility percentage badge**
- User profile preview
- Quick "Knock" action button
- Match reasons visualization

#### 4. 🚪 Knock-Knock Connection System

**Connect with Matches**
- Send "Knock" requests to potential roommates
- Personalized knock notification
- Accept/Reject incoming knocks
- Status tracking (Pending, Accepted, Rejected)

**Connection Management**
- View all sent knocks
- View received knocks
- Accept matches easily
- Navigate to connection page after acceptance

#### 5. 💬 Real-Time Chat System

**Connection Page Features**
- **Floating chat widget**
  - Modern pill-shaped input field
  - Gradient send button with hover effects
  - Minimized/Maximized states
  - Unread message badge
  - Auto scrolling
- **Chat functionality**
  - Real-time messaging
  - Message timestamps
  - Sender name display
  - Read status tracking
  - Message history
- **Chat UI/UX**
  - Bubble-style messages with tail
  - Different colors for sent/received (gradient for sent, white for received)
  - Compact spacing
  - Keyboard shortcuts (Enter to send)
  - Empty state with friendly message
  - Active chat session tracking

**Shared Dorm Suggestions**
- **Price-based room suggestions** for connected users
  - Analyzes both users' price preferences
  - Finds price range intersection or average
  - **Never empty**: Falls back to cheapest Double rooms
- **Double room focus**
  - Only shows rooms for 2 people
  - Calculates per-person split price
  - Shows total room price + individual share
- **Smart pricing display**
  - "Based on shared price range: ฿X - ฿Y"
  - "Up to ฿X" for flexible budget
  - "Best Deals" badge for fallback results
  - "Average Range" indicator
- **Detailed dorm cards**
  - Dorm image with hover effects
  - Full address display (up to 2 lines)
  - "Shared Room Deal" pricing section
  - Double room total price
  - Per-person calculated cost (₿{total}/2)
- **Visual enhancements**
  - Glassmorphism effects
  - Hover animations
  - Click to view dorm details

#### 6. 🔔 Notification System

**Real-Time Alerts**
- **Notification types**:
  - New knock requests
  - Knock acceptances
  - Booking confirmations
  - Chat messages
  - System announcements
- **Notification bell** in navbar
  - Unread count badge
  - Animated pulse for new notifications
- **Notification panel**
  - Dropdown list with recent notifications
  - Mark as read functionality
  - Delete notifications
  - Navigate to related pages
- **Auto-refresh** every 30 seconds

#### 7. 📱 User Account Management

**My Account Page**
- **Profile Information**
  - Name, email, phone
  - Date of birth
  - Address
  - Bio/description
- **Booking History**
  - All past and current bookings
  - Booking status (Pending, Confirmed, Cancelled)
  - Booking details and amounts
- **Personality Profile Viewer**
  - View/Edit personality information
  - Update preferences anytime
- **Wishlist** (planned)

**Theme Support**
- Light/Dark mode toggle
- Automatic system theme detection
- Persistent theme preference
- Smooth theme transitions

### 🛠️ For Dorm Administrators

#### 1. 📊 Admin Dashboard Overview

**Analytics Dashboard**
- **Key Metrics Cards**
  - Total Revenue (฿)
  - Total Bookings (count)
  - Average Occupancy Rate (%)
  - Monthly Revenue Growth (%)
- **Interactive Charts**
  - Revenue Trend Graph (line chart)
  - Booking Trends (bar chart)
  - Occupancy by room type
- **Recent Activity Feed**
  - Latest bookings with student details
  - Recent room reservations
  - Quick action buttons

#### 2. 🏢 Dorm Management

**My Dorms Page**
- View all owned properties
- **Create new dorm**
  - Multi-step form wizard
  - Property details
  - Location (full address with Thai administrative divisions)
  - Geographic coordinates for map
  - Pricing and policies
  - Insurance policy amount
  - Contact information (email, phone, LINE, Facebook)
  - Operating hours
- **Edit existing dorms**
  - Update any property information
  - Soft delete (isActive flag)
- **Image Management**
  - Multiple image upload
  - Drag-and-drop support
  - Image preview
  - Set primary image
- **Amenities Management**
  - Add/remove facilities
  - Predefined amenities list (WiFi, Parking, Laundry, etc.)
  - Custom amenities support

**Utility Fee Configuration**
- **Water billing setup**
  - Per-month flat rate
  - Per-unit metered billing
  - Rate amount configuration
- **Electricity billing setup**
  - Per-month flat rate
  - Per-unit metered billing
  - Rate amount configuration

#### 3. 🛏️ Room Management

**Rooms Page**
- View all rooms across all owned dorms
- Filter by dorm, floor, type, status
- **Add new rooms**
  - Room number
  - Floor designation
  - Room type (Single, Double, Suite)
  - Capacity (number of occupants)
  - Monthly price
  - Booking fee
  - Zone/Building
  - Bed type
  - Size (sqm)
  - Amenities
  - Room description
- **Edit rooms**
  - Update pricing
  - Change availability status
  - Modify amenities
- **Delete rooms**
  - Soft delete with confirmation
- **Bulk actions** (planned)

**Availability Management**
- Real-time room status
  - Available (green)
  - Occupied (gray)
  - Reserved (yellow)
  - Maintenance (red)
- Move-in date tracking
- Move-out date tracking
- Automatic status updates

#### 4. 📋 Bookings Management

**Bookings Page with RBAC**
- **View bookings** (only for own dorms)
  - Filtered by admin's property ownership
  - Cannot see other admins' bookings
  - Secure endpoint filtering
- **Booking table** with sortable columns
  - Guest name with avatar
  - Room number
  - Move-in date
  - Booking amount
  - Payment status
  - Actions column
- **Booking details modal**
  - Complete booking information
  - Student contact details
  - Payment method
  - Booking fee paid amount
  - Stay duration
  - Creation timestamp
- **Status management**
  - Update booking status (Pending → Confirmed → Cancelled)
  - Instant status change
  - Automatic user notifications
- **Refresh functionality**
  - Manual refresh button for latest data

#### 5. 📈 Analytics \u0026 Reporting

**AnalyticsPage**
- **Revenue Analytics**
  - Total revenue calculation
  - Month-over-month growth
  - Revenue by room type
  - Revenue trends chart
- **Booking Analytics**
  - Total bookings count
  - Booking conversion rate
  - Booking trends over time
- **Occupancy Analytics**
  - Current occupancy percentage
  - Available vs occupied rooms
  - Occupancy by floor
  - Seasonal trends
- **Performance Metrics**
  - Average booking value
  - Days to book (average)
  - Cancellation rate

#### 6. ⚙️ Settings

**SettingsPage**
- **Admin profile management**
  - Update contact information
  - Change password
  - Email notifications preferences
- **Dorm settings**
  - Default booking policies
  - Cancellation policies
  - Payment methods accepted
- **Notification preferences**
  - Email alerts for new bookings
  - SMS notifications (planned)

### 🔐 Security \u0026 Access Control

#### Role-Based Access Control (RBAC)

**Three User Roles**

1. **Student Role**
   - Browse dorms and rooms
   - Create personality profile
   - Find roommate matches
   - Send/receive knocks
   - Book rooms
   - View own bookings
   - Chat with connections
   - Receive notifications

2. **Dorm Admin Role**
   - All student permissions +
   - Create and manage own dorms only
   - Add/edit/delete rooms for own dorms
   - View bookings for own properties only (RBAC implemented)
   - Update booking status for own properties
   - View analytics for own dorms
   - Receive booking notifications for own properties
   - **Cannot access other admins' data**

3. **System Admin Role**
   - Full system access
   - Manage all users
   - View all dorms and rooms
   - Access all bookings
   - System-wide analytics
   - User management

**Security Implementation**
- **JWT Authentication**
  - Secure token-based auth
  - Token expiration
  - Bearer token in headers
- **Password Security**
  - bcrypt hashing (10 rounds)
  - Salted passwords
  - Password strength validation
- **RBAC Middleware**
  - `requireAuth`: Verify logged-in user
  - `requireStudent`: Student-only routes
  - `requireDormAdmin`: Admin-only routes
- **Resource Ownership Verification**
  - Bookings filtered by dorm ownership
  - Dorms filtered by admin_id
  - Notifications filtered by recipient
- **Data Privacy**
  - Users can only update own profile
  - Admins see only own property data
  - Chat messages encrypted (planned)

### 🎨 UI/UX Features

**Design System**
- **Theme Support**
  - Light mode with warm tones
  - Dark mode with cool backgrounds
  - System preference detection
  - Smooth theme transitions
- **Color Palette**
  - Primary gradient: Pink (500) → Purple (600)
  - Lime accent for ratings and success states
  - Muted backgrounds for cards
  - High contrast text
- **Typography**
  - Clear hierarchy with bold headers
  - Readable body text
  - Icon-text combinations
  - Responsive font sizing

**Component Library**
- **shadcn/ui components**
  - Cards with borders and shadows
  - Buttons with hover states
  - Input fields with focus rings
  - Badges for status display
  - Dropdowns and modals
  - Toast notifications (sonner)
- **Custom Components**
  - Navbar with notifications
  - Footer with links
  - Loader with spinning animation
  - Floating chat widget
  - Dorm cards with hover effects
  - Match cards with compatibility scores

**Responsive Design**
- Mobile-first approach
- Tablet breakpoints (md, lg)
- Desktop optimized layouts
- Touch-friendly buttons
- Collapsible sidebars
- Adaptive grids (1/2/3 columns)

**Animations \u0026 Transitions**
- Smooth page transitions
- Hover scale effects on cards
- Fade-in animations for modals
- Slide-in notifications
- Loading skeletons
- Bounce animation for chat button
- Pulse for unread notifications

**Accessibility**
- Semantic HTML
- ARIA labels
- Keyboard navigation support
- Focus indicators
- Screen reader friendly
- High contrast mode compatible

### 🚀 Performance Features

**Optimization**
- Code splitting with React Router
- Lazy loading for images
- Debounced search inputs
- Memoized calculations
- Efficient re-renders with Context API

**Data Management**
- Efficient MongoDB queries with indexes
- Pagination (planned)
- Caching strategies (planned)
- Image optimization with CDN (planned)

### 🔧 Developer Features

**Code Quality**
- TypeScript for type safety (frontend)
- ESModules throughout
- Consistent file structure
- Modular architecture
- Reusable components

**Development Tools**
- Vite for fast HMR (frontend)
- Nodemon for auto-restart (backend)
- Environment variables (.env)
- CORS configuration
- Morgan logger for API requests

---

## Technology Stack

### Frontend
```
Framework: React 18 + TypeScript
Routing: React Router v7
Styling: Tailwind CSS
UI Library: shadcn/ui (built on Radix UI)
State: React Context API
HTTP Client: Axios
Build Tool: Vite
Package Manager: pnpm
Toast Notifications: sonner
```

### Backend
```
Runtime: Node.js 18+
Framework: Express.js 5
Database: MongoDB + Mongoose
Auth: JWT + bcryptjs
AI Service: GROQ SDK (Llama 3.3 70B Versatile)
File Upload: Multer
CORS: cors middleware
Logging: morgan
```

### External Services
- **GROQ AI** - Personality analysis \u0026 compatibility assessment
- **MongoDB Atlas** - Cloud database (production)
- **Dicebear API** - Avatar generation
- **QR Server API** - PromptPay QR code generation

---

## System Architecture

### High-Level Overview

```
┌──────────────┐
│   Client     │ (React + TypeScript)
│  Port: 5173  │
└──────┬───────┘
       │ HTTPS/REST
       │
┌──────▼───────┐
│   Express    │ (Node.js + Express)
│   Backend    │
│  Port: 5001  │
└──────┬───────┘
       │
       ├─────→ MongoDB (Data)
       │
       └─────→ GROQ AI (Matching)
```

### Request Flow

1. **User Authentication**
   - Client sends credentials → Backend validates → JWT issued
   - Token stored in localStorage
   - Token sent in Authorization header for protected routes

2. **Dorm Booking**
   - Browse dorms → Select room → Fill booking form
   - Payment method selection → Submit
   - Backend creates booking → Reserves room → Notifies admin
   - Returns booking confirmation + PDF invoice

3. **Roommate Matching**
   - Create personality profile → Submit to backend
   - Client requests matches → Backend calculates compatibility
   - Optional AI analysis via GROQ
   - Returns sorted matches with scores

4. **Chat System**
   - Users connect → Chat widget opens
   - Messages sent via REST API → Stored in DB
   - Auto-refresh keeps messages in sync
   - Active session tracking

---

## Installation \u0026 Setup

### Prerequisites
- Node.js 18+ and npm/pnpm
- MongoDB (local or Atlas)
- GROQ API key ([groq.com](https://groq.com))

### Backend Setup

```bash
cd backend
npm install

# Create .env file
cat > .env << EOF
PORT=5001
MONGODB_URI=mongodb://localhost:27017/lumiq
JWT_SECRET=your_super_secret_jwt_key_change_this
CORS_ORIGIN=http://localhost:5173
GROQ_API_KEY=your_groq_api_key_here
EOF

# Start server
npm run dev
```

### Frontend Setup

```bash
cd frontend
pnpm install

# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:5001/api
EOF

# Start dev server
pnpm run dev
```

### Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5001/api
- Health Check: http://localhost:5001/api/health

---

## API Documentation

### Authentication

#### POST /api/auth/signup
Register new user

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "student"
}
```

#### POST /api/auth/signin
Login user

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

### Dorms

#### GET /api/dorms
Get all dorms (public)

#### GET /api/dorms/:id
Get dorm details

#### POST /api/dorms
Create dorm (admin only, requires JWT)

#### GET /api/dorms/shared-suggestions?userId=X
Get suggested dorms for connected users based on price preferences

### Rooms

#### GET /api/rooms
Get all rooms

#### POST /api/rooms
Create room (admin only)

#### PUT /api/rooms/:id
Update room (admin only)

### Bookings

#### GET /api/bookings
Get bookings (RBAC: admin sees own dorms, students see own bookings)

#### POST /api/bookings
Create booking (student only)

**Request:**
```json
{
  "dormId": 1,
  "roomId": "ABC123",
  "moveInDate": "2024-01-15",
  "stayDuration": 12,
  "durationType": "months",
  "paymentMethod": "card"
}
```

#### PUT /api/bookings/:id
Update booking status (admin or owner)

### Matching

#### GET /api/matching/find-match/:userId
Find compatible roommates

#### GET /api/matching/ai-analysis/:userId1/:userId2
Get AI-powered compatibility analysis

### Chat

#### GET /api/conversations
Get user's conversations

#### POST /api/conversations
Create new conversation

#### GET /api/messages?conversationId=X
Get messages for conversation

#### POST /api/messages
Send message

**Request:**
```json
{
  "conversationId": 123,
  "text": "Hey! Want to be roommates?"
}
```

### Notifications

#### GET /api/notifications
Get notifications for current user

#### PUT /api/notifications/:id/read
Mark as read

#### DELETE /api/notifications/:id
Delete notification

---

## Security \u0026 RBAC

### Authentication Flow
1. User signs up/signs in → Receives JWT
2. JWT stored in localStorage
3. Axios interceptor adds "Authorization: Bearer \u003ctoken\u003e" to all requests
4. Backend middleware verifies token
5. User role checked for protected routes

### RBAC Implementation

**Middleware Chain:**
```
Request → requireAuth → requireStudent/requireDormAdmin → Route Handler
```

**Permission Matrix:**
| Endpoint | Student | Dorm Admin | System Admin |
|----------|---------|------------|--------------|
| GET /dorms | ✅ | ✅ | ✅ |
| POST /dorms | ❌ | ✅ | ✅ |
| GET /bookings | Own only | Own dorms | All |
| PUT /bookings/:id | Own only | Own dorms | All |
| POST /rooms | ❌ | ✅ | ✅ |
| GET /analytics | ❌ | Own dorms | All |

---

## Database Schema

### Key Collections

**users**
- _id, email, password (hashed), name, role, dormId, phone, dateOfBirth

**dorms**
- _id, name, location, address{}, latitude, longitude, price, facilities[], images[], admin_id, Water_fee, Electricity_fee, waterBillingType, electricityBillingType, insurance_policy, isActive

**rooms**
- _id, dormId, room_number, floor, room_type, capacity, price_per_month, status, amenities[], moveInDate, moveOutDate

**bookings**
- _id, userId, dormId, roomId, moveInDate, stayDuration, bookingFeePaid, totalAmount, status, paymentMethod, createdAt

**personalities**
- _id, userId, nickname, age, gender, sleep_type, study_habits, cleanliness, social, MBTI, lifestyle[], smoking, drinking, pets, noise_tolerance, temperature

**knocks**
- _id, senderId, recipientId, status (pending/accepted/rejected), createdAt

**conversations**
- _id, participants[], lastMessage, lastMessageAt

**messages**
- _id, conversationId, sender{}, text, readBy[], createdAt

**notifications**
- _id, recipientId, type, title, message, read, data{}, createdAt

---

## Future Enhancements

- [ ] Email notifications for bookings
- [ ] SMS notifications
- [ ] Payment gateway integration (Stripe, Omise)
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Virtual dorm tours (360° photos)
- [ ] Review moderation system
- [ ] Multi-language support (Thai/English)
- [ ] Social media integration
- [ ] Referral program

---

## Contributors

- SanMine - Full Stack Developer

## License

This project is proprietary and confidential.

---

## Support

For issues or questions:
- Email: support@lumiq.com
- Issues: GitHub Issues (if applicable)

---

**Built with ❤️ using React, Express, MongoDB, and GROQ AI**
