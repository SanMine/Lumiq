import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, "../.env") });

import express from "express";
import cors from "cors";
import morgan from "morgan";
import { sequelize } from "../sequelize.js";
import { health } from "./routes/health.js";
import { users } from "./routes/users.js";
import { dorms } from "./routes/dorms.js";
import { rooms } from "./routes/rooms.js";
import { auth } from "./routes/auth.js";  // 🔐 Import our new authentication routes
import { errorHandler } from "./middlewares/error.js";
import { personalities } from "./routes/personalities.js"; // Import personalities routes
import { preferred_roommate } from "./routes/preferred_roommate.js";

// Import models and associations
import "./models/Association.js";

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || true }));

// Debug middleware
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.path}`);
  next();
});

// routes
app.get("/test", (req, res) => {
  res.json({ message: "Server is working!" });
});

app.use("/api", health);
app.use("/api/users", users);
app.use("/api/dorms", dorms);
app.use("/api/rooms", rooms);
app.use("/api/personalities", personalities);
app.use("/api/auth", auth);  // 🔐 Mount authentication routes at /api/auth
app.use("/api/preferred_roommate", preferred_roommate);

// Error handler (last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");
    
    // 🔧 IMPROVED DATABASE SYNC - Handle relationships properly
    try {
      // First try to sync without altering (safe for existing data)
      await sequelize.sync({ force: false, alter: false });
      console.log("✅ Database tables synced successfully");
    } catch (syncError) {
      console.log("⚠️  Standard sync failed, trying to handle foreign key issues...");
      console.log("Error details:", syncError.message);
      
      // For development, we can drop and recreate tables (THIS WILL DELETE DATA!)
      if (process.env.NODE_ENV === 'development') {
        console.log("🔄 Development mode: Recreating tables with fresh schema...");
        
        try {
          // Force recreate all tables in correct order
          await sequelize.sync({ force: true });
          console.log("✅ Database tables recreated successfully");
        } catch (forceError) {
          console.error("❌ Force sync also failed:", forceError.message);
          
          // Last resort: disable foreign key checks temporarily
          console.log("🔧 Trying without foreign key constraints...");
          await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
          await sequelize.sync({ force: true });
          await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
          console.log("✅ Database tables created with foreign keys disabled temporarily");
        }
      } else {
        // For production, we'd use proper migrations instead
        throw syncError;
      }
    }
    
    app.listen(PORT, () => console.log(`🚀 API running on http://localhost:${PORT}`));
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
})();