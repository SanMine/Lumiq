import { Router } from "express";
import { sequelize } from "../db/sequelize.js";

export const health = Router();

health.get("/health", async (_req, res) => {
  try {
    await sequelize.query("SELECT 1");
    res.json({ ok: true, db: "up", now: new Date().toISOString() });
  } catch {
    res.status(500).json({ ok: false, db: "down", now: new Date().toISOString() });
  }
});
