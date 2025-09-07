# 📝 Complete Guide: How to POST Data to Your Database

## 🚀 Step 1: Make Sure Your Server is Running

```bash
cd /Users/sanmine/Documents/GitHub/Lumiq/backend
node src/index.js
```

You should see:
```
✅ Database connected successfully
🚀 API running on http://localhost:3001
```

## 📨 Method 1: Using curl (Command Line)

### Basic POST Request:
```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

### Step-by-step explanation:
- `-X POST` = Use POST method
- `http://localhost:3001/api/users` = Your API endpoint
- `-H "Content-Type: application/json"` = Tell server we're sending JSON
- `-d '{"name": "John Doe", "email": "john@example.com"}'` = The data to send

### More Examples:
```bash
# Create user 1
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice Smith", "email": "alice@test.com"}'

# Create user 2  
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Bob Johnson", "email": "bob@test.com"}'

# Create user 3
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Carol Wilson", "email": "carol@test.com"}'
```

## 📨 Method 2: Using a JSON file

### Create a file with user data:
```bash
# Create test-user.json
echo '{"name": "David Brown", "email": "david@test.com"}' > test-user.json

# POST the file
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d @test-user.json
```

## 📨 Method 3: Using Node.js fetch() in a script

Create `test-post.js`:
```javascript
// test-post.js
const userData = {
  name: "Emma Davis",
  email: "emma@test.com"
};

fetch('http://localhost:3001/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(userData)
})
.then(response => response.json())
.then(data => {
  console.log('Success:', data);
})
.catch(error => {
  console.error('Error:', error);
});
```

Run it:
```bash
node test-post.js
```

## 📨 Method 4: Using Postman (GUI Tool)

1. Download Postman
2. Create new request
3. Set method to POST
4. Set URL: `http://localhost:3001/api/users`
5. In Headers tab, add: `Content-Type: application/json`
6. In Body tab, select "raw" and paste:
   ```json
   {
     "name": "Frank Miller",
     "email": "frank@test.com"
   }
   ```
7. Click Send

## 📨 Method 5: Using VS Code REST Client Extension

Create `api-tests.http`:
```http
### Create a new user
POST http://localhost:3001/api/users
Content-Type: application/json

{
  "name": "Grace Taylor",
  "email": "grace@test.com"
}

### Get all users
GET http://localhost:3001/api/users

### Get health status
GET http://localhost:3001/api/health
```

Click "Send Request" above each section.

## ✅ Expected Response

When POST is successful, you should see:
```json
{
  "id": 1,
  "name": "John Doe", 
  "email": "john@example.com",
  "createdAt": "2025-09-08T04:30:00.000Z",
  "updatedAt": "2025-09-08T04:30:00.000Z"
}
```

## ❌ Common Errors & Solutions

### Error: "email & name required"
**Problem**: Missing required fields
**Solution**: Make sure your JSON includes both name and email
```bash
# ❌ Wrong
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John"}'

# ✅ Correct  
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "email": "john@test.com"}'
```

### Error: "Failed to connect"
**Problem**: Server not running
**Solution**: Start your server first
```bash
cd /Users/sanmine/Documents/GitHub/Lumiq/backend
node src/index.js
```

### Error: Sequelize validation error
**Problem**: Invalid email format
**Solution**: Use proper email format
```bash
# ❌ Wrong
"email": "not-an-email"

# ✅ Correct
"email": "user@example.com"
```

## 🔍 Verify Your Data

After POSTing, check if data was saved:
```bash
# Get all users
curl http://localhost:3001/api/users

# Check health
curl http://localhost:3001/api/health
```

## 📊 Database Check

You can also check your MySQL database directly:
```sql
-- Connect to your database and run:
SELECT * FROM users;
```

## 🎯 Pro Tips

1. **Always include Content-Type header** when sending JSON
2. **Test with curl first** before building frontend
3. **Check server logs** for errors if requests fail
4. **Use proper JSON syntax** (double quotes, no trailing commas)
5. **Test edge cases** (empty data, invalid emails, duplicate emails)

## 🔄 Complete Testing Workflow

```bash
# 1. Start server
node src/index.js

# 2. Test health
curl http://localhost:3001/api/health

# 3. Create users
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User 1", "email": "test1@example.com"}'

# 4. Get all users
curl http://localhost:3001/api/users

# 5. Delete user (if needed)
curl -X DELETE http://localhost:3001/api/users/1
```

This covers all the ways to POST data to your database! 🎉
