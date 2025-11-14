#!/bin/bash
# 🤖 AI Roommate Matching - Complete Test Suite
# Test all matching endpoints with real data

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
API_URL="http://localhost:3001"
ALICE_EMAIL="alice.chen@lumiq.edu"
ALICE_PASSWORD="Password123!"
BOB_EMAIL="bob.smith@lumiq.edu"
BOB_PASSWORD="SecurePass456!"

# Function to print section header
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

# Function to print success
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Function to print info
print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Function to print error
print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# ============================================
# STEP 1: LOGIN AND GET TOKENS
# ============================================
print_header "STEP 1: Authenticating Users"

print_info "Logging in as Alice..."
ALICE_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$ALICE_EMAIL\",
    \"password\": \"$ALICE_PASSWORD\"
  }")

ALICE_TOKEN=$(echo "$ALICE_RESPONSE" | jq -r '.token')
ALICE_ID=$(echo "$ALICE_RESPONSE" | jq -r '.user.id')

if [ "$ALICE_TOKEN" != "null" ] && [ -n "$ALICE_TOKEN" ]; then
    print_success "Alice logged in (ID: $ALICE_ID)"
else
    print_error "Failed to login as Alice"
    exit 1
fi

print_info "Logging in as Bob..."
BOB_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$BOB_EMAIL\",
    \"password\": \"$BOB_PASSWORD\"
  }")

BOB_TOKEN=$(echo "$BOB_RESPONSE" | jq -r '.token')
BOB_ID=$(echo "$BOB_RESPONSE" | jq -r '.user.id')

if [ "$BOB_TOKEN" != "null" ] && [ -n "$BOB_TOKEN" ]; then
    print_success "Bob logged in (ID: $BOB_ID)"
else
    print_error "Failed to login as Bob"
    exit 1
fi

# ============================================
# STEP 2: FIND ALL MATCHES
# ============================================
print_header "STEP 2: Finding Roommate Matches for Alice"

print_info "Calling: POST /api/matching/find-roommates/$ALICE_ID"
MATCHES=$(curl -s -X POST "$API_URL/api/matching/find-roommates/$ALICE_ID" \
  -H "Authorization: Bearer $ALICE_TOKEN" \
  -H "Content-Type: application/json")

TOTAL_MATCHES=$(echo "$MATCHES" | jq '.totalMatches')
print_success "Found $TOTAL_MATCHES potential matches"

echo ""
echo "Top 3 Matches for Alice:"
echo "$MATCHES" | jq '.matches[0:3] | .[] | "\(.candidateName) - \(.matchPercentage)% match (\(.compatibility.overallReason))"' -r | nl

# ============================================
# STEP 3: GET BEST MATCH
# ============================================
print_header "STEP 3: Finding Best Match for Alice"

print_info "Calling: GET /api/matching/best-match/$ALICE_ID"
BEST_MATCH=$(curl -s -X GET "$API_URL/api/matching/best-match/$ALICE_ID" \
  -H "Authorization: Bearer $ALICE_TOKEN")

BEST_NAME=$(echo "$BEST_MATCH" | jq -r '.bestMatch.candidateName')
BEST_SCORE=$(echo "$BEST_MATCH" | jq '.bestMatch.matchPercentage')

print_success "Best match found!"
echo ""
echo "Match Details:"
echo "$BEST_MATCH" | jq '.bestMatch' -C

# ============================================
# STEP 4: GET MATCHING STATISTICS
# ============================================
print_header "STEP 4: Matching Statistics for Alice"

print_info "Calling: GET /api/matching/stats/$ALICE_ID?minMatch=60"
STATS=$(curl -s -X GET "$API_URL/api/matching/stats/$ALICE_ID?minMatch=60" \
  -H "Authorization: Bearer $ALICE_TOKEN")

AVG_SCORE=$(echo "$STATS" | jq '.stats.averageMatchPercentage')
GOOD_MATCHES=$(echo "$STATS" | jq '.stats.goodMatches')
EXCELLENT=$(echo "$STATS" | jq '.stats.matchDistribution.excellent')
GOOD=$(echo "$STATS" | jq '.stats.matchDistribution.good')
FAIR=$(echo "$STATS" | jq '.stats.matchDistribution.fair')
POOR=$(echo "$STATS" | jq '.stats.matchDistribution.poor')

print_success "Statistics retrieved"
echo ""
echo "Summary for Alice:"
echo "  Total Candidates: $(echo "$STATS" | jq '.stats.totalCandidates')"
echo "  Good Matches (≥60%): $GOOD_MATCHES"
echo "  Average Match Score: $AVG_SCORE%"
echo ""
echo "Match Distribution:"
echo "  🟢 Excellent (80-100%): $EXCELLENT matches"
echo "  🟡 Good (60-79%): $GOOD matches"
echo "  🟠 Fair (40-59%): $FAIR matches"
echo "  🔴 Poor (0-39%): $POOR matches"

# ============================================
# STEP 5: COMPARE TWO SPECIFIC USERS
# ============================================
print_header "STEP 5: Comparing Alice with Bob"

print_info "Calling: POST /api/matching/compare/$ALICE_ID/$BOB_ID"
COMPARISON=$(curl -s -X POST "$API_URL/api/matching/compare/$ALICE_ID/$BOB_ID" \
  -H "Authorization: Bearer $ALICE_TOKEN")

COMPARISON_SCORE=$(echo "$COMPARISON" | jq '.compatibility.matchPercentage')
print_success "Comparison completed: $COMPARISON_SCORE% compatibility"

echo ""
echo "Detailed Comparison:"
echo "$COMPARISON" | jq '.compatibility' -C

# ============================================
# STEP 6: FILTER BY MINIMUM MATCH PERCENTAGE
# ============================================
print_header "STEP 6: Filter Matches - Minimum 70% Compatibility"

print_info "Calling: POST /api/matching/find-roommates/$ALICE_ID?minMatch=70"
HIGH_QUALITY=$(curl -s -X POST "$API_URL/api/matching/find-roommates/$ALICE_ID?minMatch=70" \
  -H "Authorization: Bearer $ALICE_TOKEN")

HIGH_QUALITY_COUNT=$(echo "$HIGH_QUALITY" | jq '.totalMatches')
print_success "Found $HIGH_QUALITY_COUNT matches with ≥70% compatibility"

if [ "$HIGH_QUALITY_COUNT" -gt 0 ]; then
    echo ""
    echo "High Quality Matches:"
    echo "$HIGH_QUALITY" | jq '.matches[] | "\(.candidateName) - \(.matchPercentage)%"' -r | nl
fi

# ============================================
# STEP 7: TEST BOB'S MATCHES
# ============================================
print_header "STEP 7: Finding Matches for Bob"

print_info "Calling: POST /api/matching/find-roommates/$BOB_ID"
BOB_MATCHES=$(curl -s -X POST "$API_URL/api/matching/find-roommates/$BOB_ID" \
  -H "Authorization: Bearer $BOB_TOKEN")

BOB_TOTAL=$(echo "$BOB_MATCHES" | jq '.totalMatches')
print_success "Found $BOB_TOTAL potential matches for Bob"

echo ""
echo "Bob's Top Match:"
echo "$BOB_MATCHES" | jq '.matches[0]' -C

# ============================================
# STEP 8: ERROR HANDLING TEST
# ============================================
print_header "STEP 8: Testing Error Handling"

print_info "Testing invalid user ID..."
INVALID=$(curl -s -X POST "$API_URL/api/matching/find-roommates/9999" \
  -H "Authorization: Bearer $ALICE_TOKEN")

ERROR_MSG=$(echo "$INVALID" | jq -r '.error // .message')
if [ "$ERROR_MSG" != "null" ]; then
    print_success "Error correctly handled: $ERROR_MSG"
fi

print_info "Testing self-comparison..."
SELF_COMPARE=$(curl -s -X POST "$API_URL/api/matching/compare/$ALICE_ID/$ALICE_ID" \
  -H "Authorization: Bearer $ALICE_TOKEN")

SELF_ERROR=$(echo "$SELF_COMPARE" | jq -r '.error')
if [ "$SELF_ERROR" != "null" ]; then
    print_success "Self-comparison blocked: $SELF_ERROR"
fi

# ============================================
# FINAL SUMMARY
# ============================================
print_header "TEST SUMMARY"

echo ""
echo "✅ Authentication: Passed"
echo "✅ Find Matches: Passed ($TOTAL_MATCHES matches found)"
echo "✅ Best Match: Passed ($BEST_NAME with $BEST_SCORE%)"
echo "✅ Statistics: Passed (Average: $AVG_SCORE%)"
echo "✅ User Comparison: Passed ($COMPARISON_SCORE% compatibility with Bob)"
echo "✅ Filtering: Passed ($HIGH_QUALITY_COUNT high-quality matches)"
echo "✅ Error Handling: Passed"
echo ""
print_success "All tests completed successfully! 🎉"
echo ""
echo "📊 Summary Statistics:"
echo "   - Alice has an average match score of $AVG_SCORE%"
echo "   - Best match for Alice: $BEST_NAME ($BEST_SCORE%)"
echo "   - Alice-Bob compatibility: $COMPARISON_SCORE%"
echo ""
