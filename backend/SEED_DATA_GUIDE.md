# 📝 Database Seed Data Guide

## Overview
Your MongoDB database has been populated with comprehensive dummy data for testing and development!

## What Was Created ✅

### 👥 **4 Users**
1. **Alice Chen** (Student)
   - Email: `alice.chen@lumiq.edu`
   - Password: `Password123!`
   - Role: `student`

2. **Bob Smith** (Student)
   - Email: `bob.smith@lumiq.edu`
   - Password: `SecurePass456!`
   - Role: `student`

3. **Carol Johnson** (Owner)
   - Email: `carol.johnson@lumiq.edu`
   - Password: `MyPassword789!`
   - Role: `owner`

4. **Admin User** (Admin)
   - Email: `admin@lumiq.edu`
   - Password: `AdminPass123!`
   - Role: `admin`

---

### 🏢 **3 Dormitories**

#### 1. **Sunrise Heights Dormitory**
- **Location:** Downtown District, Block 5
- **Rating:** ⭐ 4.5
- **Facilities:** WiFi, Cafeteria, Gym, Library, Security 24/7
- **Insurance Policy:** ฿500
- **Water Fee:** ฿150/month
- **Electricity Fee:** ฿200/month
- **Status:** Available

#### 2. **Moonlight Residences**
- **Location:** University Ave, District 2
- **Rating:** ⭐ 4.2
- **Facilities:** WiFi, Common Kitchen, Laundry, Study Rooms, Parking
- **Insurance Policy:** ฿300
- **Water Fee:** ฿120/month
- **Electricity Fee:** ฿180/month
- **Status:** Available

#### 3. **StarLight Lodge**
- **Location:** Riverside Road, District 7
- **Rating:** ⭐ 4.8
- **Facilities:** WiFi, Fine Dining, Fitness Center, Swimming Pool, Entertainment Zone, 24/7 Security, Concierge
- **Insurance Policy:** ฿800
- **Water Fee:** ฿250/month
- **Electricity Fee:** ฿350/month
- **Status:** Available

---

### 🏠 **4 Rooms**

| Room # | Type | Dorm | Capacity | Price | Floor | Status |
|--------|------|------|----------|-------|-------|--------|
| 101 | Double | Sunrise Heights | 2 | ฿1,500/mo | 1 | Available |
| 102 | Single | Sunrise Heights | 1 | ฿1,200/mo | 1 | Available |
| 201 | Triple | Moonlight Residences | 3 | ฿900/mo | 2 | Available |
| 202 | Double | Moonlight Residences | 2 | ฿1,100/mo | 2 | Occupied |

---

### 🎭 **2 User Personality Profiles**

#### Alice Chen
- **Nickname:** Alice
- **Age:** 22
- **Gender:** Female
- **Nationality:** Thai
- **Sleep Type:** Night Owl
- **Study Habits:** Some Noise
- **Cleanliness:** Tidy
- **Social:** Social
- **MBTI:** ENFP
- **Going Out:** Frequent
- **Smoking:** No
- **Drinking:** Never
- **Pets:** Dog Person
- **Noise Tolerance:** Medium
- **Temperature:** Cool
- **Lifestyle:** Gym, Reading, Gaming

#### Bob Smith
- **Nickname:** Bob
- **Age:** 23
- **Gender:** Male
- **Nationality:** American
- **Sleep Type:** Early Bird
- **Study Habits:** Silent
- **Cleanliness:** Moderate
- **Social:** Quiet
- **MBTI:** INTJ
- **Going Out:** Occasional
- **Smoking:** No
- **Drinking:** Never
- **Pets:** Pet Friendly
- **Noise Tolerance:** Low
- **Temperature:** Warm
- **Lifestyle:** Sports, Coding, Music

---

### 💕 **2 Roommate Preferences**

#### Alice's Preferences
- **Preferred Age:** 20-25 years old
- **Preferred Gender:** Any
- **Preferred Sleep Type:** Night Owl
- **Smoking:** No
- **Pets:** No
- **Noise Tolerance:** Medium
- **Cleanliness:** Tidy
- **MBTI:** ENFP
- **Temperature:** Cool
- **Note:** "Friendly and outgoing person who enjoys social activities"

#### Bob's Preferences
- **Preferred Age:** 21-24 years old
- **Preferred Gender:** Any
- **Preferred Sleep Type:** Early Bird
- **Smoking:** No
- **Pets:** Yes
- **Noise Tolerance:** Low
- **Cleanliness:** Tidy
- **MBTI:** INTJ
- **Temperature:** Warm
- **Note:** "Quiet and focused person, interested in sports and technology"

---

### ⭐ **2 Ratings**

| User | Dorm | Rating |
|------|------|--------|
| Alice Chen | Sunrise Heights Dormitory | 5⭐ |
| Bob Smith | Moonlight Residences | 4⭐ |

---

## How to Reseed the Database

### Clear and Reseed (Destructive)
```bash
npm run seed
```
This will:
- 🗑️ Delete all existing data
- ✅ Create fresh dummy data
- Takes ~2 seconds

### Manual Reseed (If Seed Script Issues)
```bash
# Connect to your MongoDB instance
# Run these commands in MongoDB shell or Compass:

db.users.deleteMany({})
db.dorms.deleteMany({})
db.rooms.deleteMany({})
db.ratings.deleteMany({})
db.personalities.deleteMany({})
db.preferred_roommate.deleteMany({})

# Then run
npm run seed
```

---

## Testing with Seed Data

### 1️⃣ Login with Test Account
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice.chen@lumiq.edu",
    "password": "Password123!"
  }'
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "email": "alice.chen@lumiq.edu",
    "name": "Alice Chen",
    "role": "student"
  }
}
```

### 2️⃣ Get All Dorms
```bash
curl http://localhost:5000/api/dorms
```

### 3️⃣ Get All Rooms
```bash
curl http://localhost:5000/api/rooms
```

### 4️⃣ Get Personality Profile
```bash
curl http://localhost:5000/api/personalities
```

### 5️⃣ Get Roommate Preferences
```bash
curl http://localhost:5000/api/preferred_roommate
```

---

## API Endpoints to Test

### Authentication
- ✅ `POST /api/auth/register` - Try new user
- ✅ `POST /api/auth/login` - Use test credentials
- ✅ `GET /api/auth/me` - Get current user (requires token)
- ✅ `PUT /api/auth/update-profile` - Update user profile
- ✅ `PUT /api/auth/change-password` - Change password

### Users
- ✅ `GET /api/users` - List all users
- ✅ `GET /api/users/:id` - Get specific user
- ✅ `PUT /api/users/:id` - Update user

### Dorms
- ✅ `GET /api/dorms` - List all dorms (4 available)
- ✅ `GET /api/dorms/:id` - Get dorm details
- ✅ `POST /api/dorms/:id/rate` - Rate a dorm
- ✅ `GET /api/dorms/:id/ratings` - Get dorm ratings

### Rooms
- ✅ `GET /api/rooms` - List all rooms (4 rooms)
- ✅ `GET /api/rooms/:id` - Get room details
- ✅ `GET /api/rooms/dorm/:dormId/statistics` - Room stats

### Personalities
- ✅ `GET /api/personalities` - List profiles (2 profiles)
- ✅ `POST /api/personalities` - Create new profile
- ✅ `PUT /api/personalities/:id` - Update profile

### Roommate Preferences
- ✅ `GET /api/preferred_roommate` - List preferences (2 profiles)
- ✅ `POST /api/preferred_roommate` - Create preferences
- ✅ `PUT /api/preferred_roommate/:id` - Update preferences

---

## Seed Data Structure

### File Location
```
backend/src/db/seedData.js
```

### How It Works
1. Loads environment variables from `.env`
2. Connects to MongoDB
3. Clears all existing collections
4. Creates users (with password hashing)
5. Creates dorms
6. Creates rooms (linked to dorms)
7. Creates personality profiles (linked to users)
8. Creates preferred roommates (linked to users)
9. Creates ratings (linked to users & dorms)
10. Displays summary with test credentials

---

## Modifying Seed Data

To add more test data, edit `src/db/seedData.js`:

```javascript
// Add more users
const usersData = [
  {
    email: 'newuser@lumiq.edu',
    name: 'New User',
    passwordHash: 'Password123!',
    role: 'student',
  },
  // ... more users
];

// Add more dorms
const dormsData = [
  {
    name: 'New Dorm',
    location: 'New Location',
    rating: 4.0,
    // ... more fields
  },
  // ... more dorms
];

// Then run: npm run seed
```

---

## Important Notes

⚠️ **Password Security:**
- Passwords are automatically hashed with bcryptjs before storage
- Never display actual passwords to users
- All provided passwords are for testing only

✅ **Data Validation:**
- All enums are validated per schema
- All required fields are provided
- All references (ObjectIds) are properly linked

🔄 **Idempotent:**
- Running `npm run seed` multiple times is safe
- Clears old data each time
- Creates fresh data on each run

📊 **Production Ready:**
- Seed script can be easily modified for production data
- Consider creating separate seed files for different environments
- Never run on production database without backup!

---

## Troubleshooting

### ❌ Connection Error
```
❌ MongoDB connection failed: MONGODB_URI is not defined
```
**Solution:** Check `.env` file has `MONGODB_URI` set correctly

### ❌ Validation Error
```
User_personality validation failed: smoking is not valid
```
**Solution:** Check enum values in schema match seed data

### ❌ Duplicate Key Error
```
E11000 duplicate key error
```
**Solution:** Clear database and reseed: `npm run seed`

---

## Next Steps

1. ✅ **Start Server:** `npm run dev`
2. ✅ **Test Login:** Use credentials above
3. ✅ **Create Profile:** Add personality after login
4. ✅ **Set Preferences:** Add roommate preferences
5. ✅ **Test Search:** Search for compatible roommates
6. ✅ **Make Reservations:** Reserve available rooms

---

**Created:** November 14, 2025  
**Total Data:**
- 4 Users
- 3 Dorms
- 4 Rooms
- 2 Personality Profiles
- 2 Roommate Preferences
- 2 Ratings

🎉 **Happy Testing!**
