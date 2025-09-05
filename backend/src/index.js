import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDb, sequelize } from "./db/sequelize.js";
import { health } from "./routes/health.js";
import { users } from "./routes/users.js";
import { errorHandler } from "./middlewares/error.js";
import { User } from "./models/User.js";

const app = express();

// core middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || true }));

// routes
app.use("/api", health);
app.use("/api/users", users);

// error last
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDb();
  // Dev only: auto-create tables. For production, switch to migrations.
  await sequelize.sync({ alter: true });
  app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
})();
