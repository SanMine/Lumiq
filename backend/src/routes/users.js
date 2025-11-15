import { Router } from "express";
import { User } from "../models/User.js";
import { requireAuth } from "../middlewares/auth.js";

export const users = Router();

// Public route - Get all users (for matching system)
users.get("/", async (_req, res, next) => {
  try {
    const all = await User.find().sort({ _id: 1 });
    res.json(all);
  } catch (err) {
    next(err);
  }
});

// Public route - Get single user (for viewing profiles)
users.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// Protected route - Create user (admin only or registration)
users.post("/", async (req, res, next) => {
  try {
    const { email, name } = req.body;
    if (!email || !name)
      return res.status(400).json({ error: "email & name required" });
    const u = await User.create({ email, name });
    res.status(201).json(u);
  } catch (err) {
    next(err);
  }
});

// Protected route - Update user (must be authenticated)
users.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const { email, name } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Check if user is updating their own profile or is admin
    // Convert both to strings for comparison (JWT stores as string)
    const requestedUserId = String(req.params.id);
    const authenticatedUserId = String(req.user.id);
    
    if (authenticatedUserId !== requestedUserId && req.user.role !== 'admin') {
      return res.status(403).json({ error: "You can only update your own profile" });
    }

    if (email) user.email = email;
    if (name) user.name = name;
    await user.save();

    res.json(user);
  } catch (err) {
    next(err);
  }
});

// Protected route - Delete user (must be authenticated)
users.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    // Check if user is deleting their own account or is admin
    // Convert both to strings for comparison (JWT stores as string)
    const requestedUserId = String(req.params.id);
    const authenticatedUserId = String(req.user.id);
    
    if (authenticatedUserId !== requestedUserId && req.user.role !== 'admin') {
      return res.status(403).json({ error: "You can only delete your own account" });
    }

    const result = await User.findByIdAndDelete(req.params.id);
    res.json({ deleted: result ? 1 : 0 });
  } catch (err) {
    next(err);
  }
});
