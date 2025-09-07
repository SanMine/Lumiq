#!/bin/bash
# test-api.sh - Simple script to test your API

echo "🧪 Testing API..."
echo

# Check if server is running
echo "1️⃣ Testing health endpoint..."
curl -s http://localhost:3001/api/health | python3 -m json.tool 2>/dev/null || echo "❌ Server not running or health check failed"
echo
echo

# Create a test user
echo "2️⃣ Creating a test user..."
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com"}' \
  -w "\nStatus: %{http_code}\n"
echo
echo

# Get all users
echo "3️⃣ Getting all users..."
curl -s http://localhost:3001/api/users | python3 -m json.tool 2>/dev/null || echo "❌ Failed to get users"
echo
echo

echo "✅ API testing complete!"
echo "💡 To run this script: chmod +x test-api.sh && ./test-api.sh"
