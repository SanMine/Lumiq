import { Router } from "express";
import { Preferred_roommate } from "../models/Preferred_roommate.js";
import { User } from "../models/User.js";

export const preferred_roommate = Router();

preferred_roommate.get("/", async (req, res) => {
    try {
        const { userId } = req.query;
        if (userId) {
            const roommatePref = await Preferred_roommate.findOne({ where: { userId } });
            if (!roommatePref) {
                return res.status(404).json({ error: "Roommate preferences not found for this user." });
            }
            return res.json(roommatePref);
        } else {
            const allPrefs = await Preferred_roommate.findAll();
            res.json(allPrefs);
        }
    } catch (error) {
        console.error("Error fetching roommate preferences:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

    // Get roommate preferences by ID
preferred_roommate.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const roommatePref = await Preferred_roommate.findByPk(id);
        if (!roommatePref) {
            return res.status(404).json({ error: "Roommate preferences not found." });
        }
        res.json(roommatePref);
    } catch (error) {
        console.error("Error fetching roommate preferences:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// Create roommate preferences
preferred_roommate.post("/", async (req, res) => {
    try {
        const prefData = req.body;
        if (!prefData.userId) {
            return res.status(400).json({ error: "UserId is required." });
        }
        const existingPref = await Preferred_roommate.findOne({ where: { userId: prefData.userId } });
        if (existingPref) {
            return res.status(400).json({ error: "Roommate preferences already exist for this user." });
        }
        const newPref = await Preferred_roommate.create(prefData);
        res.status(201).json(newPref);
    } catch (error) {
        console.error("Error creating roommate preferences:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Update roommate preferences
preferred_roommate.put("/:id", async (req, res) => {
    try {
        const { id } = req.params; 
        const updatePref = req.body;
        const roommatePref = await Preferred_roommate.findByPk(id);
        if (!roommatePref) {
            return res.status(404).json({ error: "Roommate preferences not found." });
        }
        await roommatePref.update(updatePref);
        res.json(roommatePref);
    } catch (error) {
        console.error("Error updating roommate preferences:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Delete roommate preferences
preferred_roommate.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const roommatePref = await Preferred_roommate.findByPk(id);
        if (!roommatePref) {
            return res.status(404).json({ error: "Roommate preferences not found." });
        }
        await roommatePref.destroy();
        res.json({ message: "Roommate preferences deleted successfully." });
    } catch (error) {
        console.error("Error deleting roommate preferences:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
