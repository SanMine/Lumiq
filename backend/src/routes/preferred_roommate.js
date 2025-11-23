import { Router } from "express";
import { Preferred_roommate } from "../models/Preferred_roommate.js";
import { User } from "../models/User.js";
import { requireAuth, requireStudent } from "../middlewares/auth.js";

export const preferred_roommate = Router();

preferred_roommate.get("/", requireAuth, async (req, res, next) => {
  try {
    const { userId } = req.query;
    if (userId) {
      const roommatePref = await Preferred_roommate.findOne({ userId });
      if (!roommatePref) {
        return res.status(404).json({ error: "Roommate preferences not found for this user." });
      }
      return res.json(roommatePref);
    } else {
      const allPrefs = await Preferred_roommate.find();
      res.json(allPrefs);
    }
  } catch (error) {
    next(error);
  }
});

// Get roommate preferences by ID
preferred_roommate.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const roommatePref = await Preferred_roommate.findById(id);
    if (!roommatePref) {
      return res.status(404).json({ error: "Roommate preferences not found." });
    }
    res.json(roommatePref);
  } catch (error) {
    next(error);
  }
});

// Create roommate preferences (students only)
preferred_roommate.post("/", requireStudent, async (req, res, next) => {
  try {
    const prefData = req.body;
    if (!prefData.userId) {
      return res.status(400).json({ error: "UserId is required." });
    }
    const existingPref = await Preferred_roommate.findOne({ userId: prefData.userId });
    if (existingPref) {
      return res.status(400).json({ error: "Roommate preferences already exist for this user." });
    }
    const newPref = await Preferred_roommate.create(prefData);
    res.status(201).json(newPref);
  } catch (error) {
    next(error);
  }
});

// Update roommate preferences (students only)
preferred_roommate.put("/:id", requireStudent, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const roommatePref = await Preferred_roommate.findById(id);
    if (!roommatePref) {
      return res.status(404).json({ error: "Roommate preferences not found." });
    }
    const updatedPref = await Preferred_roommate.findByIdAndUpdate(id, updateData, { new: true });
    res.json(updatedPref);
  } catch (error) {
    next(error);
  }
});

// Delete roommate preferences (students only)
preferred_roommate.delete("/:id", requireStudent, async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedPref = await Preferred_roommate.findByIdAndDelete(id);
    if (!deletedPref) {
      return res.status(404).json({ error: "Roommate preferences not found." });
    }
    res.json({ message: "Roommate preferences deleted successfully." });
  } catch (error) {
    next(error);
  }
});
