# Backend Development Setup Guide

## Prerequisites
- Node.js (v18+)
- MySQL database (local or cloud like Railway/PlanetScale)
- Code editor (VS Code recommended)
- Terminal/Command line

## Initial Setup Commands
```bash
# 1. Create project directory
mkdir my-backend-project
cd my-backend-project

# 2. Initialize Node.js project
npm init -y

# 3. Install core dependencies
npm install express sequelize mysql2 dotenv cors morgan

# 4. Install development dependencies
npm install -D nodemon sequelize-cli

# 5. Setup package.json type
# Add "type": "module" for ES6 modules
```

## 📁 Project Structure & Purpose

```
backend/
├── 📄 package.json          # Project dependencies & scripts
├── 📄 .env                  # Environment variables (SECRET!)
├── 📄 .env.example          # Template for environment variables
├── 📄 .gitignore            # Files to ignore in git
├── 📄 sequelize.js          # Database connection setup
├── 📄 .sequelizerc          # Sequelize CLI configuration
│
├── 📁 src/                  # Main application code
│   ├── 📄 index.js          # 🚀 MAIN ENTRY POINT
│   │
│   ├── 📁 models/           # Database models (ES6)
│   │   ├── User.js          # User model definition
│   │   └── Product.js       # Product model definition
│   │
│   ├── 📁 routes/           # API endpoints
│   │   ├── auth.js          # Authentication routes
│   │   ├── users.js         # User CRUD operations
│   │   └── products.js      # Product CRUD operations
│   │
│   ├── 📁 middlewares/      # Custom middleware functions
│   │   ├── auth.js          # Authentication middleware
│   │   ├── validation.js    # Input validation
│   │   └── error.js         # Error handling
│   │
│   └── 📁 controllers/      # Business logic (optional)
│       ├── userController.js
│       └── productController.js
│
├── 📁 config/               # Configuration files
│   └── config.cjs           # Database configuration
│
├── 📁 migrations/           # Database schema changes
│   └── 20240101-create-user.cjs
│
└── 📁 seeders/             # Sample data for database
    └── 20240101-demo-users.cjs
```

### 🎯 **What Each File/Folder Does:**

#### **Root Level Files:**
- **`package.json`** - Lists dependencies, scripts, project info
- **`.env`** - Stores secrets (DB password, API keys) - NEVER commit!
- **`.env.example`** - Template showing what variables are needed
- **`.gitignore`** - Tells git to ignore node_modules, .env, etc.
- **`sequelize.js`** - Database connection configuration

#### **src/ Folder (Your Main Code):**
- **`index.js`** - The starting point, sets up Express server
- **`models/`** - Define database table structures
- **`routes/`** - Define API endpoints (GET /users, POST /products)
- **`middlewares/`** - Functions that run before/after routes
- **`controllers/`** - Business logic (optional, can put in routes)

#### **Sequelize CLI Folders:**
- **`config/`** - Database connection settings for CLI
- **`migrations/`** - Scripts to change database structure
- **`seeders/`** - Scripts to add sample data

## 🔄 **Development Order (Follow This Sequence!)**

### **Phase 1: Setup Foundation**
1. **Create project structure**
2. **Setup package.json with dependencies**
3. **Create .env file with database credentials**
4. **Setup database connection (sequelize.js)**

### **Phase 2: Database Layer**
5. **Create your first model (User.js)**
6. **Setup Sequelize CLI configuration**
7. **Create and run migrations**
8. **Test database connection**

### **Phase 3: API Layer**
9. **Create basic Express server (index.js)**
10. **Add middleware (CORS, JSON parsing, logging)**
11. **Create your first route (health check)**
12. **Create CRUD routes for your models**

### **Phase 4: Advanced Features**
13. **Add authentication middleware**
14. **Add input validation**
15. **Add error handling**
16. **Add API testing**

## 📝 **Let's Code Each Step:**

### **Step 1: Package.json Setup**

```json
{
  "name": "my-backend",
  "version": "1.0.0",
  "type": "module",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "db:migrate": "npx sequelize-cli db:migrate",
    "db:seed": "npx sequelize-cli db:seed:all"
  },
  "dependencies": {
    "express": "^4.18.0",
    "sequelize": "^6.35.0",
    "mysql2": "^3.6.0",
    "dotenv": "^16.0.0",
    "cors": "^2.8.0",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0",
    "sequelize-cli": "^6.6.0"
  }
}
```

### **Step 2: Environment Variables (.env)**

```bash
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=my_database
DB_USER=root
DB_PASSWORD=your_password
DB_DIALECT=mysql

# For production, use DATABASE_URL instead:
# DATABASE_URL=mysql://user:pass@host:port/dbname

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### **Step 3: Database Connection (sequelize.js)**

```javascript
// sequelize.js - Database connection setup
import { config } from "dotenv";
import { Sequelize } from "sequelize";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, ".env") });

// Create Sequelize instance
export const sequelize = new Sequelize(
  process.env.DB_NAME,     // database name
  process.env.DB_USER,     // username
  process.env.DB_PASSWORD, // password
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false, // Set to console.log to see SQL queries
    
    // For production with SSL:
    dialectOptions: process.env.DB_SSL === "true" 
      ? { ssl: { require: true, rejectUnauthorized: false } }
      : {}
  }
);
```

### **Step 4: Your First Model (src/models/User.js)**

```javascript
// src/models/User.js - User model definition
import { DataTypes } from "sequelize";
import { sequelize } from "../../sequelize.js";

export const User = sequelize.define("User", {
  // Define table columns
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  email: { 
    type: DataTypes.STRING(120), 
    allowNull: false, 
    unique: true, 
    validate: { isEmail: true } 
  },
  name: { 
    type: DataTypes.STRING(80), 
    allowNull: false 
  },
  passwordHash: { 
    type: DataTypes.STRING(255) 
  },
  role: { 
    type: DataTypes.ENUM('user', 'admin'), 
    defaultValue: 'user' 
  }
}, {
  // Table options
  tableName: "users",           // Explicit table name
  underscored: true,           // Use snake_case for columns
  timestamps: true,            // Adds createdAt, updatedAt
  paranoid: false              // Set true for soft deletes
});
```

### **Step 5: Express Server Setup (src/index.js)**

```javascript
// src/index.js - Main server file
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load environment variables first
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, "../.env") });

import express from "express";
import cors from "cors";
import morgan from "morgan";
import { sequelize } from "../sequelize.js";

// Import routes
import { healthRoutes } from "./routes/health.js";
import { userRoutes } from "./routes/users.js";

// Import middleware
import { errorHandler } from "./middlewares/error.js";

const app = express();
const PORT = process.env.PORT || 3001;

// 🔧 MIDDLEWARE SETUP (Order matters!)
app.use(morgan("dev"));                    // Logging
app.use(express.json());                   // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(cors({ 
  origin: process.env.CORS_ORIGIN?.split(",") || true 
}));

// 🛣️ ROUTES SETUP
app.use("/api/health", healthRoutes);      // Health check
app.use("/api/users", userRoutes);         // User operations

// 🚨 ERROR HANDLING (Must be last!)
app.use(errorHandler);

// 🚀 START SERVER
async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");
    
    // Sync database models (development only)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log("📊 Database models synchronized");
    }
    
    // Start HTTP server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
    
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
```

### **Step 6: Health Check Route (src/routes/health.js)**

```javascript
// src/routes/health.js - Health check endpoint
import { Router } from "express";
import { sequelize } from "../../sequelize.js";

export const healthRoutes = Router();

healthRoutes.get("/", async (req, res) => {
  try {
    // Test database connection
    await sequelize.authenticate();
    
    res.json({
      status: "OK",
      database: "Connected",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      database: "Disconnected",
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});
```

### **Step 7: User CRUD Routes (src/routes/users.js)**

```javascript
// src/routes/users.js - User management endpoints
import { Router } from "express";
import { User } from "../models/User.js";

export const userRoutes = Router();

// 📖 GET /api/users - Get all users
userRoutes.get("/", async (req, res, next) => {
  try {
    const users = await User.findAll({
      order: [["createdAt", "DESC"]],
      attributes: { exclude: ["passwordHash"] } // Don't send passwords!
    });
    
    res.json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    next(error); // Pass to error handler
  }
});

// 📖 GET /api/users/:id - Get single user
userRoutes.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id, {
      attributes: { exclude: ["passwordHash"] }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

// ✍️ POST /api/users - Create new user
userRoutes.post("/", async (req, res, next) => {
  try {
    const { email, name, role } = req.body;
    
    // Basic validation
    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: "Email and name are required"
      });
    }
    
    // Create user
    const user = await User.create({
      email: email.toLowerCase().trim(),
      name: name.trim(),
      role: role || 'user'
    });
    
    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.passwordHash;
    
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: userResponse
    });
    
  } catch (error) {
    // Handle unique constraint errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: "Email already exists"
      });
    }
    next(error);
  }
});

// ✏️ PUT /api/users/:id - Update user
userRoutes.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, name, role } = req.body;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    // Update user
    await user.update({
      email: email?.toLowerCase().trim(),
      name: name?.trim(),
      role
    });
    
    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.passwordHash;
    
    res.json({
      success: true,
      message: "User updated successfully",
      data: userResponse
    });
    
  } catch (error) {
    next(error);
  }
});

// 🗑️ DELETE /api/users/:id - Delete user
userRoutes.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const deletedCount = await User.destroy({
      where: { id }
    });
    
    if (deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    res.json({
      success: true,
      message: "User deleted successfully"
    });
    
  } catch (error) {
    next(error);
  }
});
```

### **Step 8: Error Handling Middleware (src/middlewares/error.js)**

```javascript
// src/middlewares/error.js - Centralized error handling
export const errorHandler = (error, req, res, next) => {
  console.error("❌ Error:", error);
  
  // Sequelize validation errors
  if (error.name === 'SequelizeValidationError') {
    const messages = error.errors.map(err => err.message);
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: messages
    });
  }
  
  // Sequelize database errors
  if (error.name === 'SequelizeDatabaseError') {
    return res.status(500).json({
      success: false,
      message: "Database error occurred"
    });
  }
  
  // Default error response
  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};
```

### **Step 9: Sequelize CLI Setup**

```javascript
// .sequelizerc - Sequelize CLI configuration
const path = require('path');

module.exports = {
  'config': path.resolve('config', 'config.cjs'),
  'models-path': path.resolve('models'),
  'seeders-path': path.resolve('seeders'),
  'migrations-path': path.resolve('migrations')
};
```

```javascript
// config/config.cjs - Database config for CLI
require("dotenv").config();

const common = {
  dialect: "mysql",
  logging: false,
  dialectOptions: process.env.DB_SSL === "true"
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {}
};

const config = {
  ...common,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

module.exports = {
  development: config,
  test: config,
  production: config
};
```

## 🎯 **Key Concepts to Understand:**

### **1. MVC Pattern (Model-View-Controller)**
- **Models** → Database structure (User.js)
- **Views** → Frontend (React, not in backend)
- **Controllers** → Business logic (routes/users.js)

### **2. Middleware Flow**
```
Request → CORS → JSON Parser → Logger → Routes → Error Handler → Response
```

### **3. Database Relationships**
```javascript
// One-to-Many example
User.hasMany(Post);
Post.belongsTo(User);

// Many-to-Many example  
User.belongsToMany(Role, { through: 'UserRoles' });
Role.belongsToMany(User, { through: 'UserRoles' });
```

### **4. API Response Format**
```javascript
// Success Response
{
  "success": true,
  "data": {...},
  "message": "Operation completed"
}

// Error Response
{
  "success": false,
  "message": "Error description",
  "errors": [...]
}
```


_______________________________________________________________________________

## 🚀 **Testing Your API**

### **Using curl commands:**
```bash
# Health check
curl http://localhost:3001/api/health

# Get all users
curl http://localhost:3001/api/users

# Create user
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "name": "Test User"}'

# Get specific user
curl http://localhost:3001/api/users/1

# Update user
curl -X PUT http://localhost:3001/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Name"}'

# Delete user
curl -X DELETE http://localhost:3001/api/users/1
```

## 🔄 **Development Workflow**

1. **Start development server:** `npm run dev`
2. **Make changes to code**
3. **Test endpoints with curl or Postman**
4. **Check database changes**
5. **Create migrations for schema changes**
6. **Commit your changes**

## 📚 **Next Steps to Learn**

1. **Authentication** (JWT tokens, bcrypt passwords)
2. **Validation** (express-validator, Joi)
3. **File uploads** (multer)
4. **Rate limiting** (express-rate-limit)
5. **API documentation** (Swagger)
6. **Testing** (Jest, supertest)
7. **Deployment** (Docker, cloud platforms)

This guide covers the fundamentals you need to build a solid Node.js + Express + MySQL backend! 🎉



## File	Purpose	What It Does
1. models/	Create database tables	Product.js = products table
2. routes/	Database logic + API paths	products.js = GET/POST/ PUT/DELETE + /products paths
3. index.js	Connect everything	Mounts routes so frontend can access them