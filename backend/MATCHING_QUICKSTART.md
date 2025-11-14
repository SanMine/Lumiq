# 🚀 Quick Start Guide - AI Roommate Matching

## Installation

### 1. Install Dependencies
```bash
cd backend
npm install groq-sdk
```

### 2. Add API Key to `.env`
Get your API key from https://console.groq.com/keys
```env
GROQ_API_KEY=your-groq-api-key-here
```

### 3. Start the Server
```bash
npm run dev
```

## Basic Usage

### Step 1: Login to Get Token
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice.chen@lumiq.edu",
    "password": "Password123!"
  }'
```

Response includes `token` field - use this for matching requests.

### Step 2: Find Matches for User
```bash
TOKEN="your_jwt_token_here"

curl -X POST http://localhost:3001/api/matching/find-roommates/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

### Step 3: Get Best Match
```bash
curl -X GET http://localhost:3001/api/matching/best-match/1 \
  -H "Authorization: Bearer $TOKEN"
```

### Step 4: View Statistics
```bash
curl -X GET "http://localhost:3001/api/matching/stats/1?minMatch=60" \
  -H "Authorization: Bearer $TOKEN"
```

## Common Queries

### Find Matches with Minimum 75% Compatibility
```bash
curl -X POST "http://localhost:3001/api/matching/find-roommates/2?minMatch=75" \
  -H "Authorization: Bearer $TOKEN"
```

### Compare Two Specific Users
```bash
curl -X POST http://localhost:3001/api/matching/compare/1/2 \
  -H "Authorization: Bearer $TOKEN"
```

## Response Format

All successful responses include:
```json
{
  "success": true,
  "userId": 1,
  "matches": [
    {
      "candidateId": 2,
      "candidateName": "Bob Smith",
      "matchPercentage": 75,
      "compatibility": {
        "personalityMatch": "Reason...",
        "lifestyleMatch": "Reason...",
        "preferenceMatch": "Reason...",
        "overallReason": "Overall reason..."
      }
    }
  ]
}
```

## API Endpoints Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/matching/find-roommates/:userId` | Get all matches for a user |
| GET | `/api/matching/best-match/:userId` | Get the best match |
| GET | `/api/matching/stats/:userId` | Get matching statistics |
| POST | `/api/matching/compare/:userId/:candidateId` | Compare two users |

## Data Structure

### Match Response
```json
{
  "candidateId": 2,
  "candidateName": "Bob Smith",
  "matchPercentage": 75,        // 0-100
  "compatibility": {
    "personalityMatch": "string",
    "lifestyleMatch": "string",
    "preferenceMatch": "string",
    "overallReason": "string"
  }
}
```

### Statistics Response
```json
{
  "stats": {
    "totalCandidates": 3,
    "goodMatches": 1,           // Matches >= minMatch threshold
    "averageMatchPercentage": 53,
    "bestMatch": {...},
    "worstMatch": {...},
    "matchDistribution": {
      "excellent": 1,           // 80-100%
      "good": 0,                // 60-79%
      "fair": 1,                // 40-59%
      "poor": 1                 // 0-39%
    }
  }
}
```

## Troubleshooting

### Issue: "GROQ_API_KEY environment variable is missing"
**Solution:** Add `GROQ_API_KEY=...` to `.env` file in backend directory

### Issue: "Cannot find module 'groq-sdk'"
**Solution:** Run `npm install groq-sdk` in backend directory

### Issue: "Invalid user ID"
**Solution:** Make sure user ID is a valid number and user exists in database

### Issue: "User not found" or "Personality profile not found"
**Solution:** User must have both personality and preference profiles created

### Issue: "Authentication required"
**Solution:** Include valid JWT token in Authorization header: `Bearer YOUR_TOKEN`

## Example: Full Workflow

```bash
#!/bin/bash

# 1. Login
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice.chen@lumiq.edu","password":"Password123!"}' | jq -r '.token')

echo "Token: $TOKEN"

# 2. Find matches
echo "Finding matches..."
curl -s -X POST http://localhost:3001/api/matching/find-roommates/1 \
  -H "Authorization: Bearer $TOKEN" | jq '.matches[0]'

# 3. Get best match
echo "Best match:"
curl -s -X GET http://localhost:3001/api/matching/best-match/1 \
  -H "Authorization: Bearer $TOKEN" | jq '.bestMatch'

# 4. Get stats
echo "Statistics:"
curl -s -X GET "http://localhost:3001/api/matching/stats/1?minMatch=70" \
  -H "Authorization: Bearer $TOKEN" | jq '.stats'
```

## Performance Notes

- First match request may take 10-15 seconds (AI processing)
- Subsequent requests complete within 2-5 seconds
- Consider implementing caching for production use
- AI model used: llama-3.1-8b-instant (fast & accurate)

## File Structure

```
backend/
├── src/
│   ├── services/
│   │   └── matchingService.js      # AI matching logic
│   ├── routes/
│   │   └── matching.js             # API endpoints
│   └── index.js                    # Server configuration
├── .env                            # Environment variables
└── MATCHING_API.md                 # Full documentation
```

## Next Steps

1. ✅ Matching service is running
2. Test all endpoints with different users
3. Implement frontend integration
4. Add caching for performance
5. Monitor AI API usage and costs

---

**API Key Status:** ✅ Active and configured
**Server Status:** ✅ Running on http://localhost:3001
**Database:** ✅ Connected to MongoDB Atlas
