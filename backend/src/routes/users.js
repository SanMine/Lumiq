import { Router } from "express";
import { User } from "../models/User.js";

export const users = Router();

users.get("/", async (_req, res) => {
  const all = await User.findAll({ order: [["id", "ASC"]] });
  res.json(all);
});

users.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) { next(err); }
});

users.post("/", async (req, res, next) => {
  try {
    const { email, name } = req.body;
    if (!email || !name) return res.status(400).json({ error: "email & name required" });
    const u = await User.create({ email, name });
    res.status(201).json(u);
  } catch (err) { next(err); }
});

users.put("/:id", async (req, res, next) => {
  try {
    const { email, name } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    
    if (email) user.email = email;
    if (name) user.name = name;
    await user.save();
    
    res.json(user);
  } catch (err) { next(err); }
});

users.delete("/:id", async (req, res) => {
  const n = await User.destroy({ where: { id: req.params.id } });
  res.json({ deleted: n });
});
