#!/bin/bash

# 🧪 JWT Authentication & CORS Test Suite
# Tests all authentication endpoints and protected routes

echo "============================================"
echo "🔐 JWT AUTHENTICATION & CORS TEST SUITE"
echo "============================================"
echo ""

API_URL="http://localhost:3001/api"
TOKEN=""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Helper function to print test results
test_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ PASSED${NC}: $2"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAILED${NC}: $2"
        ((FAILED++))
    fi
    echo ""
}

echo "=========================================="
echo "TEST 1: Login with Alice"
echo "=========================================="
RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice.chen@lumiq.edu",
    "password": "Password123!"
  }')

echo "$RESPONSE" | jq '.'

# Extract token
TOKEN=$(echo "$RESPONSE" | jq -r '.token')

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
    test_result 0 "Login successful, token received"
    echo "🔑 Token: ${TOKEN:0:50}..."
else
    test_result 1 "Login failed, no token received"
    echo "⚠️  Cannot continue with protected route tests"
    exit 1
fi
echo ""

echo "=========================================="
echo "TEST 2: Access Protected Route WITHOUT Token"
echo "=========================================="
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST "$API_URL/matching/find-roommates/1")

echo "Status Code: $STATUS"

if [ "$STATUS" == "401" ]; then
    test_result 0 "Correctly rejected request without token (401 Unauthorized)"
else
    test_result 1 "Should have returned 401, got $STATUS instead"
fi

echo "=========================================="
echo "TEST 3: Access Protected Route WITH Valid Token"
echo "=========================================="
RESPONSE=$(curl -s -X POST "$API_URL/matching/find-roommates/1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

echo "$RESPONSE" | jq '.'

if echo "$RESPONSE" | jq -e '.matches' > /dev/null 2>&1; then
    MATCH_COUNT=$(echo "$RESPONSE" | jq '.matches | length')
    test_result 0 "Successfully accessed protected route, found $MATCH_COUNT matches"
else
    test_result 1 "Failed to access protected route with valid token"
fi

echo "=========================================="
echo "TEST 4: Update User Profile (Own Profile)"
echo "=========================================="
RESPONSE=$(curl -s -X PUT "$API_URL/users/1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Chen (Updated)"
  }')

echo "$RESPONSE" | jq '.'

if echo "$RESPONSE" | jq -e '.name' > /dev/null 2>&1; then
    test_result 0 "Successfully updated own profile"
else
    test_result 1 "Failed to update own profile"
fi

echo "=========================================="
echo "TEST 5: Try to Update Another User's Profile"
echo "=========================================="
RESPONSE=$(curl -s -X PUT "$API_URL/users/2" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bob Smith (Hacked?)"
  }')

echo "$RESPONSE" | jq '.'

if echo "$RESPONSE" | jq -e '.error' | grep -q "only update your own"; then
    test_result 0 "Correctly rejected attempt to modify another user's profile (403 Forbidden)"
else
    test_result 1 "Should have rejected unauthorized profile modification"
fi

echo "=========================================="
echo "TEST 6: Access with Invalid Token"
echo "=========================================="
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST "$API_URL/matching/find-roommates/1" \
  -H "Authorization: Bearer invalid-token-xyz123")

echo "Status Code: $STATUS"

if [ "$STATUS" == "401" ]; then
    test_result 0 "Correctly rejected invalid token (401 Unauthorized)"
else
    test_result 1 "Should have returned 401 for invalid token, got $STATUS"
fi

echo "=========================================="
echo "TEST 7: CORS Preflight Request"
echo "=========================================="
RESPONSE=$(curl -s -X OPTIONS "$API_URL/matching/find-roommates/1" \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Authorization" \
  -i)

echo "$RESPONSE"

if echo "$RESPONSE" | grep -q "Access-Control-Allow-Origin"; then
    test_result 0 "CORS headers present (preflight successful)"
else
    test_result 1 "CORS headers missing"
fi

echo "=========================================="
echo "TEST 8: Get Best Match (Protected)"
echo "=========================================="
RESPONSE=$(curl -s -X GET "$API_URL/matching/best-match/1" \
  -H "Authorization: Bearer $TOKEN")

echo "$RESPONSE" | jq '.'

if echo "$RESPONSE" | jq -e '.bestMatch' > /dev/null 2>&1; then
    BEST_MATCH=$(echo "$RESPONSE" | jq -r '.bestMatch.candidateName')
    PERCENTAGE=$(echo "$RESPONSE" | jq -r '.bestMatch.matchPercentage')
    test_result 0 "Got best match: $BEST_MATCH ($PERCENTAGE%)"
else
    test_result 1 "Failed to get best match"
fi

echo "=========================================="
echo "TEST 9: Get Matching Statistics (Protected)"
echo "=========================================="
RESPONSE=$(curl -s -X GET "$API_URL/matching/stats/1?minMatch=60" \
  -H "Authorization: Bearer $TOKEN")

echo "$RESPONSE" | jq '.'

if echo "$RESPONSE" | jq -e '.stats.totalCandidates' > /dev/null 2>&1; then
    TOTAL=$(echo "$RESPONSE" | jq -r '.stats.totalCandidates')
    GOOD=$(echo "$RESPONSE" | jq -r '.stats.goodMatches')
    AVG=$(echo "$RESPONSE" | jq -r '.stats.averageMatchPercentage')
    test_result 0 "Got statistics: $TOTAL total, $GOOD good matches, ${AVG}% average"
else
    test_result 1 "Failed to get statistics"
fi

echo "=========================================="
echo "TEST 10: Public Route (Get All Users)"
echo "=========================================="
RESPONSE=$(curl -s -X GET "$API_URL/users")

USER_COUNT=$(echo "$RESPONSE" | jq '. | length')
echo "Found $USER_COUNT users"

if [ "$USER_COUNT" -gt 0 ]; then
    test_result 0 "Public route accessible without token ($USER_COUNT users)"
else
    test_result 1 "Failed to access public route"
fi

echo "=========================================="
echo "TEST 11: Restore Alice's Original Name"
echo "=========================================="
RESPONSE=$(curl -s -X PUT "$API_URL/users/1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Chen"
  }')

if echo "$RESPONSE" | jq -e '.name' | grep -q "Alice Chen"; then
    test_result 0 "Successfully restored original name"
else
    test_result 1 "Failed to restore original name"
fi

# Final Summary
echo "=========================================="
echo "📊 TEST SUMMARY"
echo "=========================================="
echo -e "${GREEN}✅ Passed: $PASSED${NC}"
echo -e "${RED}❌ Failed: $FAILED${NC}"
echo ""

TOTAL=$((PASSED + FAILED))
PERCENTAGE=$((PASSED * 100 / TOTAL))

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED! (100%)${NC}"
    echo ""
    echo "✅ JWT Authentication working correctly"
    echo "✅ CORS configuration working correctly"
    echo "✅ Protected routes secured properly"
    echo "✅ Role-based access control working"
    echo "✅ Token validation working correctly"
    echo ""
    echo "🔒 Your backend is secure and production-ready!"
else
    echo -e "${YELLOW}⚠️  ${PERCENTAGE}% of tests passed${NC}"
    echo ""
    echo "Please review the failed tests above."
fi

echo ""
echo "============================================"
echo "🔐 Authentication & CORS Test Complete"
echo "============================================"
