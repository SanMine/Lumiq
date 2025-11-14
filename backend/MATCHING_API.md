# 🤖 AI Roommate Matching API Documentation

## Overview
The Lumiq AI Roommate Matching system uses Groq's LLaMA AI model to intelligently match users based on their personality profiles and roommate preferences. The system analyzes multiple compatibility factors and provides match scores with detailed reasoning.

## Features
- ✅ **AI-Powered Matching**: Uses Groq's llama-3.1-8b-instant model for intelligent analysis
- ✅ **Personality-Based Matching**: Compares MBTI types, lifestyle habits, and behavioral traits
- ✅ **Preference Matching**: Considers user preferences for roommate characteristics
- ✅ **Match Scoring**: Returns compatibility scores from 0-100%
- ✅ **Detailed Analysis**: Provides reasoning for each match compatibility
- ✅ **Statistics & Distribution**: Shows match quality distribution and averages

## API Endpoints

### 1. Find All Roommate Matches
**Endpoint:** `POST /api/matching/find-roommates/:userId`

**Description:** Finds all compatible roommates for a specific user, ranked by compatibility percentage.

**Authentication:** Required (Bearer Token)

**Parameters:**
- `userId` (path, required): The numeric ID of the user to find matches for
- `minMatch` (query, optional): Minimum match percentage to filter results (0-100, default: 0)

**Example Request:**
```bash
curl -X POST http://localhost:3001/api/matching/find-roommates/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**Example Response:**
```json
{
  "success": true,
  "userId": 1,
  "totalMatches": 4,
  "minMatchPercentage": 0,
  "matches": [
    {
      "candidateId": 1,
      "candidateName": "Emily Lee",
      "matchPercentage": 88,
      "compatibility": {
        "personalityMatch": "ENFP match, shares similar social and outgoing preferences",
        "lifestyleMatch": "Shares night owl sleep schedule, medium noise tolerance, and cool temperature preference",
        "preferenceMatch": "Matches preferred age range, sleep type, and lifestyle",
        "overallReason": "High compatibility in personality, lifestyle, and preferences"
      }
    },
    {
      "candidateId": 2,
      "candidateName": "Bob Smith",
      "matchPercentage": 30,
      "compatibility": {
        "personalityMatch": "INTJ and ENFP personalities may clash",
        "lifestyleMatch": "Early bird sleep schedule conflicts with night owl preference",
        "preferenceMatch": "Different temperature and going out preferences",
        "overallReason": "Bob's incompatible characteristics make him a poor match"
      }
    }
  ]
}
```

**Status Codes:**
- `200 OK`: Successfully found matches
- `400 Bad Request`: Invalid user ID
- `500 Internal Server Error`: Server or AI processing error

---

### 2. Get Best Match
**Endpoint:** `GET /api/matching/best-match/:userId`

**Description:** Returns the single best compatible roommate match for a user.

**Authentication:** Required (Bearer Token)

**Parameters:**
- `userId` (path, required): The numeric ID of the user

**Example Request:**
```bash
curl -X GET http://localhost:3001/api/matching/best-match/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Example Response:**
```json
{
  "success": true,
  "userId": 1,
  "bestMatch": {
    "candidateId": 1,
    "candidateName": "Emily Lee",
    "matchPercentage": 88,
    "compatibility": {
      "personalityMatch": "ENFP match, shares similar social preferences",
      "lifestyleMatch": "Shares night owl schedule and preferences",
      "preferenceMatch": "Matches all key preferences",
      "overallReason": "High compatibility across all dimensions"
    }
  }
}
```

**Status Codes:**
- `200 OK`: Best match found
- `404 Not Found`: No compatible roommates found
- `400 Bad Request`: Invalid user ID
- `500 Internal Server Error`: Server error

---

### 3. Get Matching Statistics
**Endpoint:** `GET /api/matching/stats/:userId`

**Description:** Returns comprehensive matching statistics including distribution and averages.

**Authentication:** Required (Bearer Token)

**Parameters:**
- `userId` (path, required): The numeric ID of the user
- `minMatch` (query, optional): Minimum match percentage threshold for "good matches" (default: 60)

**Example Request:**
```bash
curl -X GET "http://localhost:3001/api/matching/stats/1?minMatch=60" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Example Response:**
```json
{
  "success": true,
  "userId": 1,
  "stats": {
    "totalCandidates": 3,
    "goodMatches": 1,
    "averageMatchPercentage": 53,
    "bestMatch": {
      "candidateId": 1,
      "candidateName": "Ethan Lee",
      "matchPercentage": 80,
      "compatibility": { ... }
    },
    "worstMatch": {
      "candidateId": 2,
      "candidateName": "Bob Smith",
      "matchPercentage": 30,
      "compatibility": { ... }
    },
    "matchDistribution": {
      "excellent": 1,    // 80-100%
      "good": 0,         // 60-79%
      "fair": 1,         // 40-59%
      "poor": 1          // 0-39%
    }
  }
}
```

**Status Codes:**
- `200 OK`: Statistics retrieved successfully
- `400 Bad Request`: Invalid user ID
- `500 Internal Server Error`: Server error

---

### 4. Compare Two Users
**Endpoint:** `POST /api/matching/compare/:userId/:candidateId`

**Description:** Compares two specific users for compatibility.

**Authentication:** Required (Bearer Token)

**Parameters:**
- `userId` (path, required): The numeric ID of the primary user
- `candidateId` (path, required): The numeric ID of the candidate to compare

**Example Request:**
```bash
curl -X POST http://localhost:3001/api/matching/compare/1/2 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Example Response:**
```json
{
  "success": true,
  "userId": 1,
  "candidateId": 2,
  "compatibility": {
    "candidateId": 2,
    "candidateName": "Bob Smith",
    "matchPercentage": 30,
    "compatibility": {
      "personalityMatch": "INTJ and ENFP personalities may clash",
      "lifestyleMatch": "Sleep schedule mismatch",
      "preferenceMatch": "Different preferences",
      "overallReason": "Poor match overall"
    }
  }
}
```

**Status Codes:**
- `200 OK`: Comparison completed successfully
- `400 Bad Request`: Invalid IDs or same user comparison
- `404 Not Found`: Candidate not found in matches
- `500 Internal Server Error`: Server error

---

## Matching Algorithm

The AI matching algorithm analyzes three key dimensions:

### 1. **Personality Match (MBTI & Traits)**
- MBTI type compatibility
- Social vs. Quiet personality
- Going out frequency
- General personality alignment

### 2. **Lifestyle Match**
- Sleep schedule alignment (Early Bird vs. Night Owl)
- Noise tolerance compatibility
- Cleanliness standards
- Temperature preferences
- Smoking and drinking habits

### 3. **Preference Match**
- Age range compatibility
- Gender preferences
- Specific roommate requirements
- Additional preferences consideration

## Match Score Interpretation

| Score Range | Interpretation | Color |
|-------------|-----------------|-------|
| 80-100% | Excellent Match | 🟢 Green |
| 60-79% | Good Match | 🟡 Yellow |
| 40-59% | Fair Match | 🟠 Orange |
| 0-39% | Poor Match | 🔴 Red |

## Implementation Details

### Technology Stack
- **AI Model**: Groq's llama-3.1-8b-instant
- **Database**: MongoDB with Mongoose ODM
- **API Framework**: Express.js
- **Authentication**: JWT Tokens

### Required User Data
For matching to work, users must have:
1. **User Profile** (basic info: name, email, role)
2. **Personality Profile** (User_personality collection)
   - Age, gender, nationality
   - Sleep type, study habits, cleanliness
   - Social preferences, MBTI type
   - Lifestyle preferences

3. **Roommate Preferences** (Preferred_roommate collection)
   - Preferred age range
   - Preferred gender
   - Sleep type preference
   - Lifestyle preferences
   - Dorm preferences

### Error Handling
- Missing personality profiles: Returns 404 with descriptive message
- Invalid user IDs: Returns 400 with "Invalid user ID"
- AI API failures: Returns 500 with error details
- Authentication issues: Returns 401 Unauthorized

## Testing Examples

### Get Matches with Minimum 70% Compatibility
```bash
POST /api/matching/find-roommates/1?minMatch=70
Authorization: Bearer eyJhbGciOi...
```

### Get Statistics for User 2
```bash
GET /api/matching/stats/2?minMatch=75
Authorization: Bearer eyJhbGciOi...
```

### Find Best Match for User 3
```bash
GET /api/matching/best-match/3
Authorization: Bearer eyJhbGciOi...
```

## Rate Limiting
Currently no rate limiting is implemented. For production, consider adding:
- 10 requests per minute per user
- 100 requests per hour per API key
- 1000 requests per day per user

## Future Enhancements
- [ ] Cache matching results for 24 hours
- [ ] Add match history tracking
- [ ] Implement mutual matching (both users like each other)
- [ ] Add matching feedback/ratings
- [ ] Real-time match updates
- [ ] Advanced filtering options
- [ ] Match recommendations based on behavior

## Support
For issues or questions about the matching API, please contact the development team.
