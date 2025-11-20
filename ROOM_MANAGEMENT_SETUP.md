# Room Management System - Setup & Implementation

## Overview
This document outlines the Room Management system for the Lumiq application, which allows dorm admins to create, read, update, and delete rooms for their dorms with proper RBAC protection.

## Architecture

### Frontend: RoomsPage.tsx
**Location:** `/frontend/src/admin-pages/RoomsPage.tsx`

**Features:**
- ✅ Dynamic room fetching from backend API
- ✅ Dorm selector (auto-selects first dorm)
- ✅ Filter rooms by status (All, Available, Occupied, Reserved, Maintenance)
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Room form with validation
- ✅ Error handling & loading states
- ✅ Automatic token-based authentication

**Props:**
```typescript
interface RoomsPageProps {
  token: string;  // JWT token from AuthContext
}
```

**State Management:**
- `rooms`: Array of Room objects
- `loading`: Loading state for data fetching
- `error`: Error message display
- `isDialogOpen`: Dialog visibility
- `editingRoom`: Currently editing room or null
- `selectedDormId`: Selected dorm ID for filtering
- `formData`: Form state for create/edit
- `dorms`: User's available dorms

**Room Data Structure:**
```typescript
interface Room {
  _id: number;                          // Auto-increment ID
  dormId: number;                       // Reference to Dorm
  room_number: string;                  // e.g., "101", "A-201"
  room_type: 'Single' | 'Double' | 'Triple';
  capacity: number;                     // 1-3 people
  price_per_month: number;              // Price in Thai Baht
  floor: number;                        // Floor number
  description?: string;                 // Optional room details
  amenities?: string;                   // e.g., "WiFi, AC, Hot water"
  images?: string[];                    // Array of image URLs
  status: 'Available' | 'Reserved' | 'Occupied' | 'Maintenance';
  current_resident_id?: number;         // Resident ID if occupied
  expected_move_in_date?: string;       // ISO date string
  expected_available_date?: string;     // ISO date string
  createdAt?: string;                   // Timestamp
  updatedAt?: string;                   // Timestamp
}
```

### Backend: rooms.js Route
**Location:** `/backend/src/routes/rooms.js`

**RBAC Protection:**
- ✅ All routes require `requireAuth` middleware
- ✅ Create, Update, Delete require `requireDormAdmin` role
- ✅ Read operations (`GET`) only require authentication
- ✅ Admin can only manage rooms for their dorm

**Endpoints:**

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/rooms?dormId={id}` | Required | Any | Get rooms by dorm |
| GET | `/api/rooms/:id` | Required | Any | Get single room |
| POST | `/api/rooms` | Required | dorm_admin | Create new room |
| PUT | `/api/rooms/:id` | Required | dorm_admin | Update room |
| DELETE | `/api/rooms/:id` | Required | dorm_admin | Delete room |
| PATCH | `/api/rooms/:id/availability` | Required | dorm_admin | Update availability |
| POST | `/api/rooms/:id/reserve` | Required | dorm_admin | Reserve room |
| POST | `/api/rooms/:id/move-in` | Required | dorm_admin | Move student in |
| POST | `/api/rooms/:id/move-out` | Required | dorm_admin | Move student out |

### Backend: Room Model
**Location:** `/backend/src/models/Room.js`

**Schema Features:**
- ✅ Auto-incrementing `_id` (number type)
- ✅ `dormId` reference to Dorm (required)
- ✅ Unique compound index: `room_number` + `dormId`
- ✅ Status enum: Available, Reserved, Occupied, Maintenance
- ✅ Timestamps: createdAt, updatedAt
- ✅ Collection name: "rooms"

**Key Properties:**
```javascript
{
  _id: Number,                    // Auto-increment
  dormId: Number (ref: Dorm),    // Required, indexed
  room_number: String,            // Unique per dorm
  room_type: Enum,                // Single/Double/Triple
  capacity: Number,               // 1-3, default 1
  price_per_month: Number,        // Required
  floor: Number,                  // Default 1
  description: String,            // Optional
  amenities: String,              // Optional
  images: [String],               // Array of URLs
  status: Enum,                   // Available/Reserved/Occupied/Maintenance
  current_resident_id: Number,    // Optional, ref: User
  expected_move_in_date: Date,    // Optional
  expected_available_date: Date,  // Optional
  timestamps: true
}
```

### Backend: RoomService
**Location:** `/backend/src/services/roomService.js`

**Key Methods:**
- `getAllRooms(filters)` - Get all rooms with optional filters
- `getRoomsByDorm(dormId)` - Get rooms for specific dorm
- `getRoomById(roomId)` - Get single room details
- `createRoom(dormId, roomData)` - Create new room
- `updateRoom(roomId, updateData)` - Update room
- `deleteRoom(roomId)` - Delete room
- `reserveRoom(roomId, userId, moveInDate)` - Reserve a room
- `moveStudentIn(roomId, userId)` - Move student into room
- `moveStudentOut(roomId, userId)` - Move student out

## API Flow Diagram

```
Frontend (RoomsPage)
    ↓
    ├─ Authorization Header: "Bearer {token}"
    ├─ VITE_API_URL: http://localhost:5001/api
    ↓
Backend (rooms.js Route)
    ↓
    ├─ requireAuth Middleware ✓
    ├─ Extract user from JWT token
    ├─ requireDormAdmin Middleware ✓ (for POST/PUT/DELETE)
    ↓
RoomService
    ↓
    ├─ Query MongoDB
    ├─ Filter by dormId
    ├─ Return data
    ↓
Response to Frontend
    ↓
    ├─ Parse and display
    ├─ Update state
    ├─ Show UI
```

## Security Implementation

### RBAC (Role-Based Access Control)

**Roles:**
- `dorm_admin`: Can create, read, update, delete rooms for their dorm
- `student`: Read-only access to available rooms
- `admin`: Full access to all rooms

**Protection Levels:**

1. **Authentication Layer** (`requireAuth`)
   - Validates JWT token
   - Extracts user ID, email, role
   - Rejects requests without valid token

2. **Authorization Layer** (`requireDormAdmin`)
   - Checks if user role is `dorm_admin`
   - Only allows dorm_admin to modify rooms
   - Prevents unauthorized modifications

3. **Data Layer**
   - Rooms are filtered by `dormId` on query
   - Only rooms belonging to the admin's dorm are returned
   - Compound index ensures room_number uniqueness per dorm

**Example Protected Request:**
```javascript
// Frontend
const response = await axios.post(
  'http://localhost:5001/api/rooms',
  {
    dormId: 1,
    room_number: '101',
    room_type: 'Single',
    capacity: 1,
    price_per_month: 3000,
    floor: 1
  },
  {
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIs...',
      'Content-Type': 'application/json'
    }
  }
);

// Backend Processing
// 1. requireAuth: Validates token → Gets user ID + role
// 2. requireDormAdmin: Checks role === 'dorm_admin'
// 3. RoomService: Creates room with dormId filter
// 4. Returns: Created room data
```

## Room Auto-Increment Implementation

**How it works:**
1. MongoDB `_id` field is typed as `Number` (not ObjectId)
2. RoomService uses counter collection for auto-increment
3. Each room gets sequential ID: 1, 2, 3, etc.
4. Counter is per-dorm via compound index

**Counter Service Pattern:**
```javascript
// In roomService or counter utility
static async getNextRoomId() {
  const counter = await RoomCounter.findByIdAndUpdate(
    { _id: 'room_id' },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return counter.sequence_value;
}
```

## Usage Instructions

### For Admins

1. **Access Room Management:**
   - Log in with dorm_admin role
   - Navigate to Admin Dashboard → Rooms tab

2. **Create a Room:**
   - Click "Add New Room" button
   - Select dorm (if multiple exist)
   - Fill form: Room Number, Type, Capacity, Floor, Price
   - Add optional: Description, Amenities
   - Click "Create Room"

3. **Edit a Room:**
   - Click "Edit" button on room card
   - Modify details
   - Click "Update Room"

4. **Delete a Room:**
   - Click "Delete" button on room card
   - Confirm deletion

5. **Filter Rooms:**
   - Use status filter buttons: All, Available, Occupied, Reserved, Maintenance

### For Students

1. **View Available Rooms:**
   - Browse available rooms
   - Filter by status/price
   - View room details (read-only)

## Testing Checklist

- [ ] Dorm selection works correctly
- [ ] Rooms fetch for selected dorm
- [ ] Create room with valid data
- [ ] Create room validation (required fields)
- [ ] Edit room updates correctly
- [ ] Delete room removes from list
- [ ] Filter by status works
- [ ] Empty state displays correctly
- [ ] Error messages show properly
- [ ] Loading states display during API calls
- [ ] RBAC: Non-admin cannot create/edit/delete
- [ ] RBAC: Token validation on all endpoints
- [ ] RBAC: Rooms properly filtered by dormId

## Environment Variables

**Frontend (.env):**
```
VITE_API_URL=http://localhost:5001/api
```

**Backend (.env):**
```
MONGODB_URI=mongodb://localhost:27017/lumiq
JWT_SECRET=your_jwt_secret_key
PORT=5001
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

## Error Handling

**Common Errors:**

1. **"Dorm not found"** - Selected dorm doesn't exist
2. **"Room not found"** - Room ID is invalid
3. **"Missing required fields"** - Form validation failed
4. **"Room admin access required"** - User doesn't have dorm_admin role
5. **"Authentication required"** - Token is missing/invalid

**Error Response Format:**
```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

## Next Steps

1. ✅ Implement room management with CRUD
2. ⏳ Add room images/gallery upload
3. ⏳ Add room booking/reservation system
4. ⏳ Add room maintenance tracking
5. ⏳ Add bulk room import (CSV)
6. ⏳ Add room statistics/analytics

## References

- Room Model: `/backend/src/models/Room.js`
- Room Routes: `/backend/src/routes/rooms.js`
- Room Service: `/backend/src/services/roomService.js`
- Auth Middleware: `/backend/src/middlewares/auth.js`
- RoomsPage Component: `/frontend/src/admin-pages/RoomsPage.tsx`
- Admin Dashboard: `/frontend/src/pages/root/admin-dashboard.tsx`
