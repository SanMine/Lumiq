# 🚀 Room Management - Quick Start Guide

## 5-Minute Setup

### Prerequisites
- Backend running: `npm run dev` (in `/backend`)
- Frontend running: `npm run dev` (in `/frontend`)
- MongoDB connected

### Step 1: Log In
1. Open frontend at `http://localhost:3000` or `http://localhost:5173`
2. Log in with **dorm_admin** account
3. Navigate to Admin Dashboard

### Step 2: Access Rooms Tab
1. Click "Rooms" tab in sidebar
2. System loads your dorms automatically
3. First dorm is auto-selected
4. Rooms list appears below

### Step 3: Create a Room
1. Click **"Add New Room"** button
2. Fill in the form:
   - **Room Number**: `101` (required)
   - **Room Type**: `Single` (required)
   - **Capacity**: `1` (required)
   - **Floor**: `1` (required)
   - **Price**: `3000` (required)
   - **Description**: Optional (e.g., "Cozy room with window")
   - **Amenities**: Optional (e.g., "WiFi, AC, Hot water")
3. Click **"Create Room"**
4. Success message appears
5. Room shows in list

### Step 4: Edit a Room
1. Click **"Edit"** on any room card
2. Modify any field
3. Click **"Update Room"**
4. Changes reflected immediately

### Step 5: Delete a Room
1. Click **"Delete"** on any room card
2. Confirm in popup dialog
3. Room removed from list

### Step 6: Filter Rooms
1. Click filter buttons: **All**, **Available**, **Occupied**, **Reserved**, **Maintenance**
2. List updates to show matching rooms

---

## 📊 What You Can Do

### For Dorm Admins
- ✅ View all rooms for your dorm
- ✅ Create new rooms
- ✅ Edit room details (price, capacity, status, etc.)
- ✅ Delete unused rooms
- ✅ Filter by room status
- ✅ Manage multiple dorms
- ✅ See room pricing and details

### Not Allowed (Protected by RBAC)
- ❌ Students cannot create rooms
- ❌ Non-admins cannot edit rooms
- ❌ Non-admins cannot delete rooms
- ❌ Anyone without token is rejected
- ❌ Invalid tokens are rejected

---

## 🔍 Key Information

### Room Fields

| Field | Type | Required | Example |
|-------|------|----------|---------|
| Room Number | Text | Yes | "101", "A-205" |
| Room Type | Dropdown | Yes | Single / Double / Triple |
| Capacity | Number | Yes | 1, 2, 3 |
| Floor | Number | Yes | 1, 2, 3 |
| Price/Month | Number | Yes | 3000, 5000 |
| Description | Text | No | "Cozy corner room" |
| Amenities | Text | No | "WiFi, AC, Hot water" |
| Status | Dropdown | Auto | Available |

### Room Statuses
- **Available** - Empty, ready to rent
- **Occupied** - Currently has tenant
- **Reserved** - Booked but tenant hasn't moved in
- **Maintenance** - Undergoing repairs

---

## 🆘 Troubleshooting

### "No dorms found"
**Solution:** You need to create a dorm first in the "Dorms" tab

### "Dorm admin access required"
**Solution:** Make sure you're logged in as a user with `dorm_admin` role

### "Authentication required"
**Solution:** 
- Reload the page
- Log in again
- Check your login credentials

### Rooms not showing
**Solution:**
- Select a dorm from the dropdown
- Check if any rooms exist for that dorm
- Try the "All" filter

### Can't edit/delete rooms
**Solution:**
- Check your user role (must be dorm_admin)
- Ensure token is valid
- Try logging out and back in

---

## 📝 API Calls Made

### When you open Rooms tab:
```
GET /api/dorms (to load your dorms)
GET /api/rooms?dormId=6 (to load rooms)
```

### When you create a room:
```
POST /api/rooms
{
  "dormId": 6,
  "room_number": "101",
  "room_type": "Single",
  "capacity": 1,
  "price_per_month": 3000,
  "floor": 1
}
```

### When you edit a room:
```
PUT /api/rooms/1
{
  "room_number": "102",
  "price_per_month": 3500,
  ...
}
```

### When you delete a room:
```
DELETE /api/rooms/1
```

---

## 🔐 Security in Action

### Authentication
- Your JWT token is sent with every request
- Token validates your identity
- Invalid tokens are rejected (401 Unauthorized)

### Authorization
- Only `dorm_admin` users can create/edit/delete
- Students get 403 Forbidden error
- Rooms are filtered by your dorm

### Examples:
```
✅ Admin creates room → Success
❌ Student creates room → 403 Forbidden
❌ No token → 401 Unauthorized
❌ Invalid token → 401 Unauthorized
```

---

## 📱 UI Layout

### Main View
```
┌─ Room Management ─────────────────────┐
│                                       │
│ [Select Dorm ▼] Dorm 1 or Dorm 2    │
│                                       │
│ [All] [Available] [Occupied]...      │
│ [Add New Room] button                │
│                                       │
│ ┌──────────┬──────────┬──────────┐  │
│ │ Room 101 │ Room 102 │ Room 201 │  │
│ │ Single   │ Double   │ Single   │  │
│ │ ฿3000/mo │ ฿4500/mo │ ฿3000/mo │  │
│ │ [Edit]   │ [Edit]   │ [Edit]   │  │
│ │ [Delete] │ [Delete] │ [Delete] │  │
│ └──────────┴──────────┴──────────┘  │
│                                       │
└─────────────────────────────────────┘
```

### Form Dialog
```
┌─ Add New Room ──────────────────────┐
│                                     │
│ Room Number: [101____________]     │
│ Room Type:   [Single ▼]            │
│ Capacity:    [1]                   │
│ Floor:       [1]                   │
│ Price:       [3000]                │
│ Description: [_________            │
│              _________]            │
│ Amenities:   [_________            │
│              _________]            │
│                                     │
│ [Cancel]        [Create Room]      │
│                                     │
└─────────────────────────────────────┘
```

---

## ✅ Verification Checklist

After setup, verify these work:

- [ ] Can view your dorm's rooms
- [ ] Can create room with valid data
- [ ] Room appears in list after create
- [ ] Can edit room details
- [ ] Changes show after edit
- [ ] Can delete room
- [ ] Delete confirmation appears
- [ ] Room disappears after delete
- [ ] Filter buttons work
- [ ] Status filter updates list
- [ ] Form validation catches missing fields
- [ ] Error messages appear on errors
- [ ] Loading spinners show during requests
- [ ] Empty state displays if no rooms

---

## 🎓 Learning Points

### What This Implementation Teaches

1. **Frontend-Backend Communication**
   - How React components fetch data from API
   - Using Axios for HTTP requests
   - Token-based authentication

2. **Database Operations**
   - Creating records in MongoDB
   - Reading filtered data by dormId
   - Updating and deleting records

3. **Security**
   - JWT token validation
   - Role-based access control (RBAC)
   - Authorization middleware

4. **User Experience**
   - Form validation
   - Loading states
   - Error handling
   - Confirmation dialogs

5. **State Management**
   - Using useState for UI state
   - Using useEffect for API calls
   - Managing form state

---

## 📚 Full Documentation

For more details, see:
- `ROOM_MANAGEMENT_SETUP.md` - Complete setup guide
- `ROOM_MANAGEMENT_QUICK_REF.md` - Quick reference
- `ROOM_MANAGEMENT_COMPLETE.md` - Full documentation
- `ROOM_MANAGEMENT_BEFORE_AFTER.md` - Before/after comparison
- `IMPLEMENTATION_SUMMARY.txt` - Implementation report

---

## 🆘 Getting Help

### Check These First
1. Backend console for errors
2. Frontend browser console (F12)
3. Network tab (XHR requests)
4. Are you logged in as dorm_admin?
5. Is MongoDB running?

### Common Error Messages
| Error | Cause | Solution |
|-------|-------|----------|
| "Dorm admin access required" | Wrong role | Log in as admin |
| "No dorms found" | No dorms created | Create dorm first |
| "Authentication required" | No token | Log in |
| API 500 error | Backend crash | Check backend console |
| Empty list | No rooms for dorm | Create a room |

---

## 🎯 What's Next?

After getting comfortable with room creation:

1. **Create multiple rooms** for same dorm
2. **Create multiple dorms** and switch between them
3. **Test with different user roles** (if available)
4. **Try error scenarios** (missing fields, etc.)
5. **Check database directly** to see saved data
6. **Review the code** to understand the flow

---

## 💡 Pro Tips

1. **Room Numbers**: Use clear naming like "101", "A-201" or "Suite-1"
2. **Pricing**: Enter actual price in Thai Baht
3. **Amenities**: Use comma-separated values: "WiFi, AC, Hot water"
4. **Floor Numbers**: Match your actual dorm layout
5. **Status**: Manually set if needed, or system defaults to "Available"

---

**Happy room management! 🎉**

For questions or issues, check the documentation files or debug using the browser console.
