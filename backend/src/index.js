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
import { errorHandler } from "./middlewares/error.js";
import { User } from "./models/User.js";
import { Dorm } from "./models/Dorm.js";

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

// Error handler (last)
app.use(errorHandler);

// **IMPORTANT: Listen on Railway's PORT or fallback to 5000 locally**
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");
    
    // Dev only: auto-create tables. For production, switch to migrations.
    await sequelize.sync({ alter: true });
    
    app.listen(PORT, () => console.log(`🚀 API running on http://localhost:${PORT}`));
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
})();
