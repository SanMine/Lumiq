import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, "../.env") });

import express from "express";
import cors from "cors";
import morgan from "morgan";
import session from "express-session";
import passport from "passport";
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
import { bookings } from "./routes/bookings.js";
import { knocks } from "./routes/knocks.js";
import { wishlist } from "./routes/wishlist.js";
import { analytics } from "./routes/analytics.js";
import { notifications } from "./routes/notifications.js";
import { conversations } from "./routes/conversations.js";
import { messages } from "./routes/messages.js";
import { chatSessions } from "./routes/chatSessions.js";
import { googleAuth } from "./routes/google-auth.js";
import configureGoogleOAuth from "./config/passport-config.js";

// Import models to ensure they are registered with Mongoose
import "./models/Association.js";
import "./models/Booking.js";
import "./models/AiMatchResult.js";
import "./models/Conversation.js";
import "./models/Message.js";

const app = express();

// CORS Configuration - Allow credentials and auth headers
const corsOptions = {
  // Allow common local dev origins (Vite default 5173 and CRA 3000).
  origin: process.env.CORS_ORIGIN?.split(',').map(url => url.trim()) || ['http://localhost:3000', 'http://localhost:5173'],
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

// Session configuration (required for Passport)
app.use(session({
  secret: process.env.JWT_SECRET || 'lumiq-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport and configure Google OAuth
app.use(passport.initialize());
app.use(passport.session());
configureGoogleOAuth();

// Serve uploaded files (payment slips, images, etc.)
app.use('/uploads', express.static(join(__dirname, '../uploads')));

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
app.use("/api/bookings", bookings);
app.use("/api/knocks", knocks);
app.use("/api/notifications", notifications);
app.use("/api/wishlist", wishlist);
app.use("/api/analytics", analytics);
app.use("/api/conversations", conversations);
app.use("/api/messages", messages);
app.use("/api/chat-sessions", chatSessions);

// Google OAuth routes (mounted at /auth to match Google Console redirect URIs)
app.use("/auth", googleAuth);

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