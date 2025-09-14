import { Router } from "express";
import { User } from "../models/User.js";
// 🔧 ISSUE FIXED: This import works correctly after fixing Association.js exports
// The User_personality model is now properly exported and can be imported
import { User_personality} from "../models/User_personality.js";

export const personalities = Router();

// Get all personalities
personalities.get("/", async (req, res)=> {
    try {
       const {userId} = req.query;
       if (userId) {
           // 🔧 DATABASE ISSUE FIXED: The "personalities" table now exists after forcing database sync
           // Previously threw "Unknown column 'id' in 'field list'" error
           const userPersonality = await User_personality.findOne({ where: { userId } });
           if (!userPersonality) {
               return res.status(404).json({ error: "Personality not found for this user." });
           }
           return res.json(userPersonality);
       } else {
           const allPersonalities = await User_personality.findAll();
           res.json(allPersonalities);
       }
    } catch (error) {
        console.error("Error fetching personalities:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get personality by ID
personalities.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const personality = await User_personality.findByPk(id);
        if (!personality) {
            return res.status(404).json({ error: "Personality not found." });
        }
        res.json(personality);
    } catch (error) {
        console.error("Error fetching personality:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Create personality
personalities.post("/", async (req, res) => {
    try {
        const personalityData = req.body;
        if (!personalityData.userId) {
            return res.status(400).json({ error: "UserId is required." });
        }
        const existingPersonality = await User_personality.findOne({ where: { userId: personalityData.userId } });
        if (existingPersonality) {
            return res.status(400).json({ error: "Personality profile already exists for this user." });
        }
        const newPersonality = await User_personality.create(personalityData);
        res.status(201).json(newPersonality);
    } catch (error) {
        console.error("Error creating personality:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Update personality
personalities.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatePersonality = req.body;
        const personality = await User_personality.findByPk(id);
        if (!personality) {
            return res.status(404).json({ error: "Personality not found." });
        }
        await personality.update(updatePersonality);
        res.json(personality);
    } catch (error) {
        console.error("Error updating personality:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Delete personality
personalities.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const personality = await User_personality.findByPk(id);
        if (!personality) {
            return res.status(404).json({ error: "Personality not found." });
        }
        await personality.destroy();
        res.json({ message: "Personality deleted successfully." });
    } catch (error) {
        console.error("Error deleting personality:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});