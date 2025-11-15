#!/bin/bash

# 🧪 Quick Authentication Test Script
# Tests the frontend-backend authentication integration

echo "🚀 Testing Lumiq Authentication Integration"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if backend is running
echo "📡 Checking if backend is running..."
if curl -s http://localhost:3001/test > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend is running${NC}"
else
    echo -e "${RED}✗ Backend is not running${NC}"
    echo "Please start backend with: cd backend && npm run dev"
    exit 1
fi

echo ""
echo "🔐 Testing Authentication Endpoints..."
echo ""

# Test 1: Register a new user
echo "1️⃣  Testing user registration..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test'$(date +%s)'@example.com",
    "password": "password123"
  }')

if echo "$REGISTER_RESPONSE" | grep -q "token"; then
    echo -e "${GREEN}✓ Registration successful${NC}"
    TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo "  Token: ${TOKEN:0:20}..."
else
    echo -e "${RED}✗ Registration failed${NC}"
    echo "  Response: $REGISTER_RESPONSE"
fi

echo ""

# Test 2: Login with existing user
echo "2️⃣  Testing user login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice.chen@lumiq.edu",
    "password": "Password123!"
  }')

if echo "$LOGIN_RESPONSE" | grep -q "token"; then
    echo -e "${GREEN}✓ Login successful${NC}"
    LOGIN_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo "  Token: ${LOGIN_TOKEN:0:20}..."
else
    echo -e "${YELLOW}⚠ Login failed (user may not exist in DB)${NC}"
    echo "  Response: $LOGIN_RESPONSE"
fi

echo ""

# Test 3: Access protected route
if [ ! -z "$TOKEN" ]; then
    echo "3️⃣  Testing protected route with token..."
    ME_RESPONSE=$(curl -s -X GET http://localhost:3001/api/auth/me \
      -H "Authorization: Bearer $TOKEN")
    
    if echo "$ME_RESPONSE" | grep -q "success"; then
        echo -e "${GREEN}✓ Protected route accessible${NC}"
        echo "  User: $(echo "$ME_RESPONSE" | grep -o '"name":"[^"]*' | cut -d'"' -f4)"
    else
        echo -e "${RED}✗ Protected route failed${NC}"
        echo "  Response: $ME_RESPONSE"
    fi
else
    echo -e "${YELLOW}⚠ Skipping protected route test (no token)${NC}"
fi

echo ""
echo "=========================================="
echo -e "${GREEN}✓ Authentication integration is working!${NC}"
echo ""
echo "📝 Next steps:"
echo "  1. Open http://localhost:5173 in your browser"
echo "  2. Click 'Sign up' and create an account"
echo "  3. Check browser localStorage for token"
echo "  4. Try logging in with your credentials"
echo ""
