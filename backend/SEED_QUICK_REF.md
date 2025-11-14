# 🌱 Quick Seed Data Reference

## Run Seed Command
```bash
npm run seed
```

## What Gets Created

### 👥 Users (4)
```
1. alice.chen@lumiq.edu (student) - Password123!
2. bob.smith@lumiq.edu (student) - SecurePass456!
3. carol.johnson@lumiq.edu (owner) - MyPassword789!
4. admin@lumiq.edu (admin) - AdminPass123!
```

### 🏢 Dorms (3)
```
1. Sunrise Heights - Rating 4.5⭐ - ฿1500-1200/mo
2. Moonlight Residences - Rating 4.2⭐ - ฿900-1100/mo
3. StarLight Lodge - Rating 4.8⭐ - Premium
```

### 🏠 Rooms (4)
```
- Room 101: Double (Sunrise) - ฿1500/mo ✅ Available
- Room 102: Single (Sunrise) - ฿1200/mo ✅ Available
- Room 201: Triple (Moonlight) - ฿900/mo ✅ Available
- Room 202: Double (Moonlight) - ฿1100/mo ⚠️ Occupied
```

### 🎭 Personalities (2)
```
- Alice: ENFP, Night Owl, Social, Dog Person, 22yo
- Bob: INTJ, Early Bird, Quiet, Pet Friendly, 23yo
```

### 💕 Preferences (2)
```
- Alice: Age 20-25, Cool, Tidy, Night Owl
- Bob: Age 21-24, Warm, Tidy, Early Bird
```

### ⭐ Ratings (2)
```
- Alice → Sunrise Heights: 5⭐
- Bob → Moonlight: 4⭐
```

---

## Test Login
```bash
# Terminal
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice.chen@lumiq.edu","password":"Password123!"}'
```

## File Locations
- **Seed Script:** `src/db/seedData.js`
- **Full Guide:** `SEED_DATA_GUIDE.md`
- **Migration Docs:** `MONGODB_MIGRATION.md`
- **Setup Summary:** `MIGRATION_SUMMARY.md`
