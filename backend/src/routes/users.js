import { Router } from "express";
import { User } from "../models/User.js";
import { requireAuth } from "../middlewares/auth.js";
import bcrypt from "bcryptjs";

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

// Protected route - Get single user (requires authentication)
users.get("/:id", requireAuth, async (req, res, next) => {
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
    const { email, name, phone, dateOfBirth, address, bio } = req.body;
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
    if (phone !== undefined) user.phone = phone;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
    if (address !== undefined) user.address = address;
    if (bio !== undefined) user.bio = bio;
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

// Protected route - Change password
users.put("/:id/password", requireAuth, async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    
    // Validate required fields
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: "All password fields are required" });
    }
    
    // Check if new passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "New passwords do not match" });
    }
    
    // Check password length
    if (newPassword.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
    
    // Find user and explicitly select passwordHash (it's excluded by default)
    const user = await User.findById(req.params.id).select('+passwordHash');
    if (!user) return res.status(404).json({ error: "User not found" });
    
    // Check if user is updating their own password
    const requestedUserId = String(req.params.id);
    const authenticatedUserId = String(req.user.id);
    
    if (authenticatedUserId !== requestedUserId) {
      return res.status(403).json({ error: "You can only change your own password" });
    }
    
    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }
    
    // Update password - the pre-save hook will hash it automatically
    user.passwordHash = newPassword;
    await user.save();
    
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
});
