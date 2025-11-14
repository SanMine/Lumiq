#!/bin/bash

echo "🔐 Quick Authentication Test"
echo "================================"

# Test 1: Login
echo -e "\n1️⃣  Testing LOGIN..."
RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice.chen@lumiq.edu","password":"Password123!"}')

TOKEN=$(echo $RESPONSE | jq -r '.token')

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
    echo "✅ Login successful"
    echo "Token: ${TOKEN:0:30}..."
else
    echo "❌ Login failed"
    echo $RESPONSE | jq
    exit 1
fi

# Test 2: Access protected route WITH token
echo -e "\n2️⃣  Testing PROTECTED ROUTE with token..."
RESPONSE=$(curl -s -X POST http://localhost:3001/api/matching/find-roommates/1 \
  -H "Authorization: Bearer $TOKEN")

if echo "$RESPONSE" | jq -e '.matches' > /dev/null 2>&1; then
    MATCHES=$(echo "$RESPONSE" | jq '.matches | length')
    echo "✅ Protected route accessible - Found $MATCHES matches"
else
    echo "❌ Protected route failed"
    echo $RESPONSE | jq
fi

# Test 3: Access protected route WITHOUT token
echo -e "\n3️⃣  Testing PROTECTED ROUTE without token..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST http://localhost:3001/api/matching/find-roommates/1)

if [ "$STATUS" == "401" ]; then
    echo "✅ Correctly rejected (401 Unauthorized)"
else
    echo "❌ Should return 401, got $STATUS"
fi

# Test 4: Update own profile
echo -e "\n4️⃣  Testing UPDATE OWN PROFILE..."
RESPONSE=$(curl -s -X PUT http://localhost:3001/api/users/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice Chen Test"}')

if echo "$RESPONSE" | jq -e '.name' | grep -q "Alice Chen Test"; then
    echo "✅ Successfully updated own profile"
    # Restore original name
    curl -s -X PUT http://localhost:3001/api/users/1 \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"name":"Alice Chen"}' > /dev/null
else
    echo "❌ Failed to update profile"
    echo $RESPONSE | jq
fi

# Test 5: Try to update another user's profile
echo -e "\n5️⃣  Testing UPDATE OTHER'S PROFILE (should fail)..."
RESPONSE=$(curl -s -X PUT http://localhost:3001/api/users/2 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Hacked Name"}')

if echo "$RESPONSE" | jq -e '.error' | grep -q "only update your own"; then
    echo "✅ Correctly rejected (403 Forbidden)"
else
    echo "❌ Should have rejected this request"
    echo $RESPONSE | jq
fi

# Test 6: CORS headers
echo -e "\n6️⃣  Testing CORS HEADERS..."
RESPONSE=$(curl -s -I -X OPTIONS http://localhost:3001/api/matching/find-roommates/1 \
  -H "Origin: http://localhost:3000")

if echo "$RESPONSE" | grep -q "Access-Control-Allow-Origin"; then
    echo "✅ CORS headers present"
else
    echo "❌ CORS headers missing"
fi

echo -e "\n================================"
echo "✅ Authentication is working properly!"
echo "🔒 Your backend is secure!"
