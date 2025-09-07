/*
COMPLETE BEGINNER'S BACKEND GUIDE
==================================

This file shows you all the pieces and how they connect.
It's like a blueprint for understanding your backend.

STEP-BY-STEP EXPLANATION:
========================
*/

// Step 1: DEPENDENCIES (package.json)
/*
{
  "name": "my-backend",
  "type": "module",
  "scripts": {
    "dev": "nodemon src/index.js",
    "start": "node src/index.js"
  },
  "dependencies": {
    "express": "Web server framework",
    "sequelize": "Database ORM (Object-Relational Mapping)",
    "mysql2": "MySQL database driver", 
    "dotenv": "Environment variables loader",
    "cors": "Cross-Origin Resource Sharing"
  }
}
*/

// Step 2: ENVIRONMENT VARIABLES (.env file)
/*
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=test_db
*/

// Step 3: DATABASE CONNECTION (sequelize.js)
import { Sequelize } from "sequelize";
import { config } from "dotenv";
config(); // Load .env variables

export const sequelize = new Sequelize(
  process.env.DB_NAME,     // Which database to connect to
  process.env.DB_USER,     // Database username
  process.env.DB_PASSWORD, // Database password
  {
    host: process.env.DB_HOST, // Where is the database?
    dialect: "mysql"           // What type of database?
  }
);

// Step 4: DATABASE MODEL (src/models/User.js)
import { DataTypes } from "sequelize";

export const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

// Step 5: WEB SERVER (src/index.js)
import express from "express";
import cors from "cors";

const app = express(); // Create web server

// MIDDLEWARE - Functions that process requests
app.use(cors());         // Allow cross-origin requests
app.use(express.json()); // Parse JSON from request bodies

// API ENDPOINTS - The URLs your frontend can call
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.findAll(); // Get all users from database
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const { name, email } = req.body;    // Get data from request
    const user = await User.create({ name, email }); // Save to database
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// START THE SERVER
const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await sequelize.authenticate(); // Test database connection
    await sequelize.sync();         // Create tables if they don't exist
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Database connected`);
      console.log(`🔗 Try: curl http://localhost:${PORT}/api/users`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

startServer();

/*
HOW IT ALL WORKS TOGETHER:
==========================

1. User sends HTTP request to your server
   ↓
2. Express receives the request
   ↓  
3. Middleware processes the request (CORS, JSON parsing)
   ↓
4. Route handler function runs
   ↓
5. Sequelize talks to MySQL database
   ↓
6. Data comes back from database
   ↓
7. Express sends JSON response to user

WHAT EACH PIECE DOES:
====================

📁 sequelize.js     → Connects to your MySQL database
📁 models/User.js   → Defines what a "User" looks like in the database
📁 src/index.js     → The main server that handles web requests
📁 .env             → Stores secret configuration (passwords, etc.)
📁 package.json     → Lists what libraries your project needs

TESTING YOUR API:
================

# Get all users
curl http://localhost:3001/api/users

# Create a new user  
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'

COMMON BEGINNER MISTAKES:
========================

❌ Forgetting to start the database server
❌ Wrong database credentials in .env
❌ Not running 'npm install' to install dependencies
❌ Forgetting 'await' with database operations
❌ Not handling errors properly
❌ Mixing up CommonJS (require) and ES6 (import) syntax

NEXT FEATURES TO ADD:
====================

1. User authentication (login/logout)
2. Input validation (check email format)
3. Password hashing (bcrypt)
4. API rate limiting
5. File uploads
6. Email sending
7. Admin dashboard

Remember: Start simple, then add complexity step by step! 🚀
*/
