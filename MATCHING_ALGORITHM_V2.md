# Roommate Matching Algorithm V2
## Algorithmic Bidirectional Matching System

### Overview
This document describes the improved roommate matching algorithm that implements **bidirectional matching** with a **two-stage evaluation process**.

### Key Improvements
1. **Bidirectional Matching**: Considers both users' preferences and personalities
2. **Two-Stage Evaluation**: 60% threshold on first check before proceeding
3. **Algorithmic Scoring**: Precise, deterministic, and transparent
4. **Detailed Reasons**: Specific feedback for each attribute match
5. **No AI Costs**: Fast, reliable, and cost-effective

---

## Matching Process

### Stage 1: User A Preferences → User B Personality
**Threshold: ≥60% required to proceed**

The algorithm compares User A's preferences with User B's actual personality traits:

| Attribute | Weight | Scoring Logic |
|-----------|--------|---------------|
| Age Range | 10 | Within range = 10, Outside = 0 |
| Gender | 10 | Match or "Any" = 10, Mismatch = 0 |
| Sleep Type | 10 | Match or "Any" = 10, Different = 5 |
| MBTI | 10 | Match or "Any" = 10, Different = 5 |
| Cleanliness | 10 | Exact = 10, Adjacent level = 7, Far = 3 |
| Smoking | 10 | Match = 10, Mismatch = 0 |
| Pets | 10 | Match = 10, Mismatch = 3 |
| Noise Tolerance | 10 | Match or "Flexible" = 10, Different = 5 |
| Temperature | 10 | Match or "Flexible" = 10, Different = 5 |
| Nationality | 10 | Match or empty = 10, Different = 5 |

**Total Possible Score: 100 points**

**Result:**
- If score ≥ 60%: Proceed to Stage 2
- If score < 60%: **Reject match** (not what they're looking for)

### Stage 2: User A Personality → User B Preferences
**Only evaluated if Stage 1 passes**

The algorithm compares User A's personality with User B's preferences using the same scoring logic.

### Final Match Score
```
Final Score = (Stage 1 Score + Stage 2 Score) / 2
```

Only matches with Stage 1 ≥ 60% are included in results.

---

## Match Categories

| Score Range | Category | Description |
|-------------|----------|-------------|
| 90-100% | Exceptional | Highly compatible, excellent match |
| 80-89% | Excellent | Strong compatibility, aligned preferences |
| 70-79% | Very Good | Most key preferences align well |
| 60-69% | Good | Core compatibility with minor differences |
| <60% | Rejected | Not shown (failed first check) |

---

## Detailed Reason Generation

Each match includes detailed breakdowns with visual indicators:

- **✓ (Checkmark)**: Perfect match on this attribute
- **~ (Tilde)**: Partial match or minor difference
- **✗ (Cross)**: Mismatch on this attribute

### Example Output
```json
{
  "candidateId": 4,
  "candidateName": "Bob Smith",
  "matchPercentage": 75,
  "compatibility": {
    "personalityMatch": "Your personality matches 80% of their preferences...",
    "lifestyleMatch": "Their personality matches 70% of your preferences...",
    "preferenceMatch": "Your preferences match their personality at 70%...",
    "overallReason": "Very good match at 75%..."
  },
  "detailedScores": {
    "yourPreferencesVsTheirPersonality": 70,
    "yourPersonalityVsTheirPreferences": 80,
    "breakdown": {
      "preferencesMatchDetails": [
        "✓ Age 23 is within your preferred range (20-25)",
        "✗ Smoking preference doesn't match..."
      ],
      "personalityMatchDetails": [
        "✓ Your age 22 fits their preferred range...",
        "~ Your MBTI differs from their preference..."
      ]
    }
  }
}
```

---

## API Usage

### Find Roommate Matches
```bash
POST /api/matching/find-roommates/:userId
Authorization: Bearer <token>
```

**Query Parameters:**
- `minMatch` (optional): Minimum match percentage filter (default: 0)

**Response:**
```json
{
  "success": true,
  "userId": 2,
  "totalMatches": 3,
  "minMatchPercentage": 0,
  "matches": [/* array of match objects */]
}
```

### Get Matching Statistics
```bash
GET /api/matching/stats/:userId
Authorization: Bearer <token>
```

**Response includes:**
- Total candidates evaluated
- Number of good matches
- Average match percentage
- Best and worst matches
- Match distribution by category

---

## Data Requirements

For matching to work, users must have:

1. **User Profile**: Basic user information
2. **Personality Profile**: Complete User_personality document
3. **Roommate Preferences**: Complete Preferred_roommate document

**Note:** Users without both personality AND preferences are excluded from matching.

---

## Technical Implementation

### File Structure
- **Service**: `/app/backend/src/services/matchingService.js`
- **Routes**: `/app/backend/src/routes/matching.js`
- **Models**: 
  - `/app/backend/src/models/User_personality.js`
  - `/app/backend/src/models/Preferred_roommate.js`

### Key Functions
1. `findRoommateMatches(userId)` - Main matching function
2. `calculatePreferenceToPersonalityMatch()` - Stage 1 evaluation
3. `calculatePersonalityToPreferenceMatch()` - Stage 2 evaluation
4. `generateOverallReason()` - Creates comprehensive match summary

---

## Advantages Over AI-Based Matching

✅ **Transparency**: Clear scoring logic for each attribute
✅ **Consistency**: Same input always produces same result
✅ **Speed**: No API calls, instant results
✅ **Cost**: No AI API costs
✅ **Reliability**: No dependency on external services
✅ **Control**: Easy to adjust weights and scoring rules
✅ **Debugging**: Clear audit trail for each decision

---

## Future Enhancements

Potential improvements:
1. Configurable weights for different attributes
2. Machine learning to optimize weights based on successful matches
3. Compatibility predictions based on historical data
4. Group matching (3+ roommates)
5. Time-based preferences (semester vs year-long)
6. Location and dorm preferences integration

---

## Testing

### Test Credentials (from seed data)
```
Email: alice.chen@lumiq.edu
Password: Password123!

Email: bob.smith@lumiq.edu
Password: SecurePass456!
```

### Example Test
```bash
# 1. Login
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice.chen@lumiq.edu","password":"Password123!"}'

# 2. Get matches (use token from login)
curl -X POST http://localhost:8001/api/matching/find-roommates/2 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json"
```

---

## Summary

The new algorithmic bidirectional matching system provides:
- **Precise matching** with 60% threshold on first check
- **Detailed reasons** for every attribute
- **Fast, reliable, cost-effective** solution
- **Full transparency** in scoring logic
- **Mutual compatibility** verification

This ensures User A only sees matches where:
1. User B's personality fits User A's preferences (≥60%)
2. User A's personality fits User B's preferences (evaluated)
3. Both checks are considered for final score
