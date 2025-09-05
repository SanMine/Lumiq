import { Router } from "express";
import { User } from "../models/User.js";

export const users = Router();

users.get("/", async (_req, res) => {
  const all = await User.findAll({ order: [["id", "ASC"]] });
  res.json(all);
});

users.post("/", async (req, res, next) => {
  try {
    const { email, name } = req.body;
    if (!email || !name) return res.status(400).json({ error: "email & name required" });
    const u = await User.create({ email, name });
    res.status(201).json(u);
  } catch (err) { next(err); }
});

users.delete("/:id", async (req, res) => {
  const n = await User.destroy({ where: { id: req.params.id } });
  res.json({ deleted: n });
});
