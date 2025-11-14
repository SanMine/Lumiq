import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, "../.env") });

import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDatabase } from "./db/connection.js";
import { health } from "./routes/health.js";
import { users } from "./routes/users.js";
import { dorms } from "./routes/dorms.js";
import { rooms } from "./routes/rooms.js";
import { auth } from "./routes/auth.js";
import { errorHandler } from "./middlewares/error.js";
import { personalities } from "./routes/personalities.js";
import { preferred_roommate } from "./routes/preferred_roommate.js";
import matchingRoutes from "./routes/matching.js";

// Import models to ensure they are registered with Mongoose
import "./models/Association.js";

const app = express();

// CORS Configuration - Allow credentials and auth headers
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization']
};

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors(corsOptions));

// Debug middleware
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.path}`);
  next();
});

// Routes
app.get("/test", (req, res) => {
  res.json({ message: "Server is working!" });
});

app.use("/api", health);
app.use("/api/users", users);
app.use("/api/dorms", dorms);
app.use("/api/rooms", rooms);
app.use("/api/personalities", personalities);
app.use("/api/auth", auth);
app.use("/api/preferred_roommate", preferred_roommate);
app.use("/api/matching", matchingRoutes);

// Error handler (last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDatabase();
    console.log("✅ Database connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
})();