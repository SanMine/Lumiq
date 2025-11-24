import { Router } from "express";
import { Knock } from "../models/Knock.js";
import { User } from "../models/User.js";
import { Notification } from "../models/Notification.js";
import { requireAuth, requireStudent } from "../middlewares/auth.js";

export const knocks = Router();

// Get all knocks for a user (sent and received)
knocks.get("/", requireAuth, async (req, res, next) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: "userId query parameter is required" });
        }

        // RBAC: Users can only view their own knocks
        if (req.user._id !== Number(userId) && req.user.id !== Number(userId)) {
            return res.status(403).json({ error: "You can only view your own knocks" });
        }

        // Find all knocks where user is either sender or recipient
        const userKnocks = await Knock.find({
            $or: [
                { senderId: Number(userId) },
                { recipientId: Number(userId) }
            ]
        }).sort({ createdAt: -1 });

        res.json(userKnocks);
    } catch (error) {
        next(error);
    }
});

// Get specific knock by ID
knocks.get("/:id", requireAuth, async (req, res, next) => {
    try {
        const { id } = req.params;
        const knock = await Knock.findById(Number(id));

        if (!knock) {
            return res.status(404).json({ error: "Knock not found" });
        }

        // RBAC: Only sender or recipient can view this knock
        const currentUserId = req.user._id || req.user.id;
        if (knock.senderId !== currentUserId && knock.recipientId !== currentUserId) {
            return res.status(403).json({ error: "You don't have permission to view this knock" });
        }

        res.json(knock);
    } catch (error) {
        next(error);
    }
});

// Send a knock (students only)
knocks.post("/", requireStudent, async (req, res, next) => {
    try {
        const { recipientId } = req.body;
        const senderId = req.user._id || req.user.id;

        if (!recipientId) {
            return res.status(400).json({ error: "recipientId is required" });
        }

        // Prevent sending knock to self
        if (Number(recipientId) === senderId) {
            return res.status(400).json({ error: "You cannot send a knock to yourself" });
        }

        // Check if recipient exists and is a student
        const recipient = await User.findById(Number(recipientId));
        if (!recipient) {
            return res.status(404).json({ error: "Recipient user not found" });
        }

        if (recipient.role === "dorm_admin") {
            return res.status(400).json({ error: "Cannot send knocks to dorm administrators" });
        }

        // Check if knock already exists from this sender to this recipient
        const existingKnock = await Knock.findOne({
            senderId: senderId,
            recipientId: Number(recipientId)
        });

        if (existingKnock) {
            return res.status(400).json({
                error: "A knock already exists between you and this user",
                knock: existingKnock
            });
        }

        // Create new knock
        const newKnock = await Knock.create({
            senderId,
            recipientId: Number(recipientId),
            status: "pending"
        });

        // Create a notification for the recipient about the new knock
        try {
            // Fetch sender info to get the name
            const sender = await User.findById(senderId);
            const senderName = sender ? sender.name : "Someone";

            const notification = await Notification.create({
                recipientId: Number(recipientId),
                type: "knock",
                title: "Knock Knock!",
                message: `${senderName} wants to connect with you!`,
                data: { knockId: newKnock._id, senderId: senderId }
            });
            console.log("✅ Notification created:", notification);
        } catch (notifError) {
            console.error("❌ Failed to create notification:", notifError);
        }

        res.status(201).json(newKnock);
    } catch (error) {
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({ error: "A knock already exists between you and this user" });
        }
        next(error);
    }
});

// Accept a knock (students only)
knocks.put("/:id/accept", requireStudent, async (req, res, next) => {
    try {
        const { id } = req.params;
        const currentUserId = req.user._id || req.user.id;

        const knock = await Knock.findById(Number(id));

        if (!knock) {
            return res.status(404).json({ error: "Knock not found" });
        }

        // RBAC: Only the recipient can accept a knock
        if (knock.recipientId !== currentUserId) {
            return res.status(403).json({ error: "Only the recipient can accept this knock" });
        }

        // Check if knock is still pending
        if (knock.status !== "pending") {
            return res.status(400).json({ error: `Knock has already been ${knock.status}` });
        }

        // Update knock status to accepted
        knock.status = "accepted";
        await knock.save();

        // Notify the sender that their knock was accepted
        try {
            // Fetch accepter info to get the name
            const accepter = await User.findById(knock.recipientId);
            const accepterName = accepter ? accepter.name : "Someone";

            const notification = await Notification.create({
                recipientId: knock.senderId,
                type: "knock",
                title: "Connection Accepted! 🎉",
                message: `${accepterName} accepted your connection request!`,
                data: { knockId: knock._id, accepterId: knock.recipientId }
            });
            console.log("✅ Acceptance notification created:", notification);
        } catch (notifError) {
            console.error("❌ Failed to create acceptance notification:", notifError);
        }

        res.json(knock);
    } catch (error) {
        next(error);
    }
});

// Reject a knock (students only)
knocks.put("/:id/reject", requireStudent, async (req, res, next) => {
    try {
        const { id } = req.params;
        const currentUserId = req.user._id || req.user.id;

        const knock = await Knock.findById(Number(id));

        if (!knock) {
            return res.status(404).json({ error: "Knock not found" });
        }

        // RBAC: Only the recipient can reject a knock
        if (knock.recipientId !== currentUserId) {
            return res.status(403).json({ error: "Only the recipient can reject this knock" });
        }

        // Check if knock is still pending
        if (knock.status !== "pending") {
            return res.status(400).json({ error: `Knock has already been ${knock.status}` });
        }

        // Update knock status to rejected
        knock.status = "rejected";
        await knock.save();

        res.json(knock);
    } catch (error) {
        next(error);
    }
});

// Delete a knock (students only)
knocks.delete("/:id", requireStudent, async (req, res, next) => {
    try {
        const { id } = req.params;
        const currentUserId = req.user._id || req.user.id;

        const knock = await Knock.findById(Number(id));

        if (!knock) {
            return res.status(404).json({ error: "Knock not found" });
        }

        // RBAC: Only sender or recipient can delete a knock
        if (knock.senderId !== currentUserId && knock.recipientId !== currentUserId) {
            return res.status(403).json({ error: "You don't have permission to delete this knock" });
        }

        await Knock.findByIdAndDelete(Number(id));
        res.json({ message: "Knock deleted successfully" });
    } catch (error) {
        next(error);
    }
});
