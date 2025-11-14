# MongoDB + Mongoose Migration Complete ✅

## Overview
Successfully migrated the Lumiq dormitory management backend from **MySQL + Sequelize** to **MongoDB + Mongoose**.

## What Changed

### Dependencies Updated
- **Removed:** `mysql2`, `sequelize`, `sequelize-cli`, `sqlite3`
- **Added:** `mongoose@^8.0.0`
- **Description:** Changed `Express + Sequelize + MySQL` to `Express + Mongoose + MongoDB`

### Database Configuration
- **Old:** Multiple config files (`config/config.cjs`, `.env` with MySQL credentials)
- **New:** Single MongoDB connection string in `.env`: `MONGODB_URI=mongodb+srv://username:password@cluster0.c2dzvjk.mongodb.net/lumiq`
- **Connection File:** `src/db/connection.js` - Handles Mongoose connection with error handling

### Files Deleted (Old MySQL Setup)
```
backend/sequelize.js          ❌ Removed
backend/config/config.cjs     ❌ Removed
backend/migrations/           ❌ Removed (all migration files)
backend/models/index.js       ❌ Removed
```

### Models Converted to Mongoose Schemas
All 7 models have been converted to Mongoose:

1. **User** - Basic user authentication with password hashing
   - Methods: `comparePassword()`, `hashPassword()`, `findByEmailWithPassword()`
   - Features: Password auto-hashing on save, password field excluded by default

2. **Dorm** - Dormitory information
   - Fields: name, location, rating, facilities, fees, etc.
   - Clean schema with no virtual fields needed in MongoDB

3. **Room** - Room management
   - References: `dormId` (Dorm), `current_resident_id` (User)
   - Compound index: unique `room_number` per `dormId`
   - Features: images stored as array, status tracking

4. **Rating** - Dorm ratings
   - References: `userId` (User), `dormId` (Dorm)
   - Compound index: unique rating per user per dorm
   - Range: 1-5 stars

5. **User_personality** - User personality profile
   - Reference: `userId` (User)
   - Unique index on `userId`
   - Comprehensive personality attributes

6. **Preferred_roommate** - Roommate preferences
   - Reference: `userId` (User)
   - Unique index on `userId`
   - Preference fields: age range, gender, lifestyle preferences

7. **Association.js** - Updated to document relationships via refs

### Routes Updated
All routes have been converted from Sequelize to Mongoose methods:

| Old Method | New Method |
|-----------|-----------|
| `Model.findAll()` | `Model.find()` |
| `Model.findByPk()` | `Model.findById()` |
| `Model.create()` | `Model.create()` |
| `Model.update()` | `Model.findByIdAndUpdate()` |
| `Model.destroy()` | `Model.findByIdAndDelete()` |
| `where: {}` | Direct query objects in `find()` |

### Routes Modified
- ✅ `src/routes/users.js` - CRUD operations
- ✅ `src/routes/dorms.js` - Dorm listing with ratings
- ✅ `src/routes/rooms.js` - Room management
- ✅ `src/routes/auth.js` - Authentication & password handling
- ✅ `src/routes/health.js` - Health check (MongoDB connection)
- ✅ `src/routes/personalities.js` - User personality profiles
- ✅ `src/routes/preferred_roommate.js` - Roommate preferences

### Services Updated
- ✅ `src/services/roomService.js` - Room business logic
  - Aggregation queries converted to JavaScript array operations
  - Support for filtering, sorting, statistics
  
- ✅ `src/services/ratingService.js` - Rating calculations
  - Simple aggregation calculations
  - Rating distribution analysis

### Environment Variables
**Updated `.env`:**
```env
# MongoDB Configuration
NODE_ENV=development

# MongoDB Connection String (Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster0.c2dzvjk.mongodb.net/lumiq?retryWrites=true&w=majority

# Server Configuration
PORT=5000
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

**Note:** The connection string uses:
- Database: `lumiq`
- Authentication: `username:password`
- Cluster: `cluster0.c2dzvjk.mongodb.net`
- CORS set to `0.0.0.0/0` for testing (change in production!)

## Key Improvements with Mongoose

### 1. Schema Validation
- Built-in validation at schema level
- Enum validation for fixed choice fields
- Min/Max constraints

### 2. Middleware (Pre/Post Hooks)
- Automatic password hashing before save
- Can add more middleware as needed

### 3. References & Population
```javascript
// Populate related documents
await Room.findById(roomId)
  .populate("dormId", "id name location")
  .populate("current_resident_id", "id name email");
```

### 4. Indexes
- Compound indexes for unique combinations
- Better query performance

## How to Run

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Ensure MongoDB Connection
Verify `.env` has correct `MONGODB_URI`:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.c2dzvjk.mongodb.net/lumiq
```

### 3. Start the Server
```bash
npm run dev      # Development with nodemon
npm start        # Production mode
```

### 4. Test Connection
```bash
curl http://localhost:5000/api/health
# Expected: { "ok": true, "db": "up", "now": "2025-11-14T..." }
```

## Important Notes

### ObjectIds vs UUIDs
- MongoDB uses `ObjectId` as primary key (MongoDB's `_id` field)
- In responses, use `_id` from Mongoose documents
- Frontend should handle `_id` instead of `id`

### Timestamps
- All models have `timestamps: true`
- Automatically creates `createdAt` and `updatedAt` fields

### Population vs Joins
- Mongoose `.populate()` makes separate queries (not SQL joins)
- This is fine for small datasets; for large data, consider aggregation

### Password Security
- Passwords are automatically hashed using bcryptjs
- Never log or return `passwordHash` field (excluded by default with `select: false`)

## Migration Checklist

- ✅ Install Mongoose
- ✅ Create MongoDB connection file
- ✅ Convert all 7 models
- ✅ Update 7 route files
- ✅ Update 2 service files
- ✅ Update health check
- ✅ Update auth middleware (compatible)
- ✅ Remove Sequelize files
- ✅ Update package.json
- ✅ Update .env configuration

## Testing Recommendations

1. **Basic Connectivity**
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **User Creation**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","name":"Test User","password":"password123"}'
   ```

3. **Dorm Listing**
   ```bash
   curl http://localhost:5000/api/dorms
   ```

4. **Room Operations**
   ```bash
   curl http://localhost:5000/api/rooms
   ```

## Troubleshooting

### Connection Timeout
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check internet connectivity
- Verify `MONGODB_URI` in `.env`

### Model Not Found Errors
- Ensure all model imports are correct
- Check collection names match schema definitions
- Models are defined in `src/models/` directory

### Password Hashing Issues
- Use `User.hashPassword()` static method for manual hashing
- Use `user.comparePassword()` instance method for comparison
- Always use `findByEmailWithPassword()` when you need the password field

## Future Enhancements

1. Add MongoDB aggregation pipelines for complex queries
2. Implement data validation with Mongoose validators
3. Add MongoDB transactions for multi-document operations
4. Consider indexing strategy for frequently queried fields
5. Implement query result caching with Redis

---

**Migration Date:** November 14, 2025
**Status:** ✅ Complete and Ready for Testing
**Next Step:** Run `npm install && npm run dev` to start the server
