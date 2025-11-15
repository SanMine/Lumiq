import { Router } from "express";
import { User } from "../models/User.js";
import { User_personality } from "../models/User_personality.js";

export const personalities = Router();

// Get all personalities
personalities.get("/", async (req, res, next) => {
  try {
    const { userId } = req.query;
    if (userId) {
      const userPersonality = await User_personality.findOne({ userId });
      if (!userPersonality) {
        return res.status(404).json({ error: "Personality not found for this user." });
      }
      return res.json(userPersonality);
    } else {
      const allPersonalities = await User_personality.find();
      res.json(allPersonalities);
    }
  } catch (error) {
    next(error);
  }
});

// Get personality by ID
personalities.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const personality = await User_personality.findById(id);
    if (!personality) {
      return res.status(404).json({ error: "Personality not found." });
    }
    res.json(personality);
  } catch (error) {
    next(error);
  }
});

// Create personality
personalities.post("/", async (req, res, next) => {
  try {
    const personalityData = req.body;
    if (!personalityData.userId) {
      return res.status(400).json({ error: "UserId is required." });
    }
    const existingPersonality = await User_personality.findOne({ userId: personalityData.userId });
    if (existingPersonality) {
      return res.status(400).json({ error: "Personality profile already exists for this user." });
    }
    const newPersonality = await User_personality.create(personalityData);
    res.status(201).json(newPersonality);
  } catch (error) {
    next(error);
  }
});

// Update personality
personalities.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const personality = await User_personality.findById(id);
    if (!personality) {
      return res.status(404).json({ error: "Personality not found." });
    }
    const updatedPersonality = await User_personality.findByIdAndUpdate(id, updateData, { new: true });
    res.json(updatedPersonality);
  } catch (error) {
    next(error);
  }
});

// Delete personality
personalities.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedPersonality = await User_personality.findByIdAndDelete(id);
    if (!deletedPersonality) {
      return res.status(404).json({ error: "Personality not found." });
    }
    res.json({ message: "Personality deleted successfully." });
  } catch (error) {
    next(error);
  }
});