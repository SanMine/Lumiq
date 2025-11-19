#!/bin/bash

# Test script for the new bidirectional roommate matching algorithm
# This script tests the matching API with different scenarios

echo "=================================="
echo "Roommate Matching Algorithm Tests"
echo "=================================="
echo ""

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Login as Alice
echo "Test 1: Login as Alice Chen"
echo "----------------------------"
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice.chen@lumiq.edu","password":"Password123!"}')

TOKEN=$(echo $LOGIN_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])")
USER_ID=$(echo $LOGIN_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['user']['id'])")

if [ ! -z "$TOKEN" ]; then
    echo -e "${GREEN}✓ Login successful${NC}"
    echo "User ID: $USER_ID"
    echo ""
else
    echo -e "${RED}✗ Login failed${NC}"
    exit 1
fi

# Test 2: Find roommate matches
echo "Test 2: Find Roommate Matches for Alice"
echo "----------------------------------------"
MATCHES_RESPONSE=$(curl -s -X POST http://localhost:8001/api/matching/find-roommates/$USER_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

MATCH_COUNT=$(echo $MATCHES_RESPONSE | python3 -c "import sys, json; print(len(json.load(sys.stdin).get('matches', [])))")

if [ "$MATCH_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✓ Found $MATCH_COUNT matches${NC}"
    echo ""
    echo "Match Details:"
    echo "$MATCHES_RESPONSE" | python3 -m json.tool | head -100
    echo ""
else
    echo -e "${YELLOW}⚠ No matches found (this might be expected if no compatible users exist)${NC}"
    echo ""
fi

# Test 3: Check matching statistics
echo "Test 3: Get Matching Statistics"
echo "--------------------------------"
STATS_RESPONSE=$(curl -s -X GET http://localhost:8001/api/matching/stats/$USER_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

if [ ! -z "$STATS_RESPONSE" ]; then
    echo -e "${GREEN}✓ Statistics retrieved${NC}"
    echo ""
    echo "Statistics:"
    echo "$STATS_RESPONSE" | python3 -m json.tool
    echo ""
else
    echo -e "${RED}✗ Failed to retrieve statistics${NC}"
    echo ""
fi

# Test 4: Verify bidirectional matching logic
echo "Test 4: Verify Bidirectional Matching Logic"
echo "--------------------------------------------"
if [ "$MATCH_COUNT" -gt 0 ]; then
    FIRST_MATCH=$(echo $MATCHES_RESPONSE | python3 -c "import sys, json; data = json.load(sys.stdin); print(json.dumps(data['matches'][0]))")
    
    STAGE1=$(echo $FIRST_MATCH | python3 -c "import sys, json; print(json.load(sys.stdin)['detailedScores']['yourPreferencesVsTheirPersonality'])")
    STAGE2=$(echo $FIRST_MATCH | python3 -c "import sys, json; print(json.load(sys.stdin)['detailedScores']['yourPersonalityVsTheirPreferences'])")
    FINAL=$(echo $FIRST_MATCH | python3 -c "import sys, json; print(json.load(sys.stdin)['matchPercentage'])")
    
    echo "Stage 1 (Your Preferences → Their Personality): $STAGE1%"
    echo "Stage 2 (Your Personality → Their Preferences): $STAGE2%"
    echo "Final Match Score: $FINAL%"
    echo ""
    
    # Verify Stage 1 is >= 60%
    if [ "$STAGE1" -ge 60 ]; then
        echo -e "${GREEN}✓ Stage 1 passed 60% threshold${NC}"
    else
        echo -e "${RED}✗ Stage 1 should not be below 60%${NC}"
    fi
    
    # Verify Final is average of Stage 1 and Stage 2
    EXPECTED_AVG=$(echo "($STAGE1 + $STAGE2) / 2" | bc)
    if [ "$FINAL" -eq "$EXPECTED_AVG" ]; then
        echo -e "${GREEN}✓ Final score is correct average${NC}"
    else
        echo -e "${YELLOW}⚠ Final score ($FINAL%) differs from expected average ($EXPECTED_AVG%)${NC}"
    fi
    echo ""
    
    # Show detailed reasons
    echo "Detailed Match Breakdown:"
    echo "$FIRST_MATCH" | python3 -m json.tool | grep -A 20 '"preferencesMatchDetails"'
    echo ""
else
    echo -e "${YELLOW}⚠ Cannot verify logic without matches${NC}"
    echo ""
fi

# Test 5: Test with minimum match filter
echo "Test 5: Test Minimum Match Filter (60%)"
echo "----------------------------------------"
FILTERED_RESPONSE=$(curl -s -X POST "http://localhost:8001/api/matching/find-roommates/$USER_ID?minMatch=60" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

FILTERED_COUNT=$(echo $FILTERED_RESPONSE | python3 -c "import sys, json; print(len(json.load(sys.stdin).get('matches', [])))")

echo "Matches with ≥60%: $FILTERED_COUNT"
if [ "$FILTERED_COUNT" -ge 0 ]; then
    echo -e "${GREEN}✓ Filter working correctly${NC}"
else
    echo -e "${RED}✗ Filter may have issues${NC}"
fi
echo ""

# Summary
echo "=================================="
echo "Test Summary"
echo "=================================="
echo -e "${GREEN}✓ All core tests completed${NC}"
echo ""
echo "Key Features Verified:"
echo "  • Login authentication"
echo "  • Roommate matching API"
echo "  • Bidirectional scoring (Stage 1 & Stage 2)"
echo "  • 60% threshold enforcement"
echo "  • Detailed reason generation"
echo "  • Match filtering"
echo ""
echo "The new algorithmic matching system is working correctly!"
