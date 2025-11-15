import { Router } from "express";
import mongoose from "mongoose";

export const health = Router();

health.get("/health", async (_req, res) => {
  try {
    const mongoState = mongoose.connection.readyState;
    const isConnected = mongoState === 1;
    res.json({
      ok: isConnected,
      db: isConnected ? "up" : "down",
      now: new Date().toISOString(),
    });
  } catch {
    res.status(500).json({
      ok: false,
      db: "down",
      now: new Date().toISOString(),
    });
  }
});
