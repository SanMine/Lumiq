import { Router } from "express";
import { Conversation } from "../models/Conversation.js";
import { Knock } from "../models/Knock.js";
import { requireAuth, requireStudent } from "../middlewares/auth.js";

export const conversations = Router();

// Get or create conversation between two users
conversations.post("/", requireStudent, async (req, res, next) => {
    try {
        const { recipientId } = req.body;
        const currentUserId = req.user._id || req.user.id;

        if (!recipientId) {
            return res.status(400).json({ error: "recipientId is required" });
        }

        // Prevent conversation with self
        if (Number(recipientId) === currentUserId) {
            return res.status(400).json({ error: "Cannot create conversation with yourself" });
        }

        // Verify mutual knocks exist and one is accepted
        const knocks = await Knock.find({
            $or: [
                { senderId: currentUserId, recipientId: Number(recipientId) },
                { senderId: Number(recipientId), recipientId: currentUserId }
            ]
        });

        const hasAcceptedKnock = knocks.some(k => k.status === 'accepted');

        if (!hasAcceptedKnock) {
            return res.status(403).json({
                error: "No accepted connection found. You must have an accepted knock to start a conversation."
            });
        }

        // Check if conversation already exists
        const existingConversation = await Conversation.findOne({
            participants: { $all: [currentUserId, Number(recipientId)] }
        });

        if (existingConversation) {
            return res.json(existingConversation);
        }

        // Create new conversation
        const newConversation = await Conversation.create({
            participants: [currentUserId, Number(recipientId)],
            lastMessage: "",
            lastMessageAt: new Date()
        });

        res.status(201).json(newConversation);
    } catch (error) {
        next(error);
    }
});

// Get conversation by ID
conversations.get("/:id", requireAuth, async (req, res, next) => {
    try {
        const { id } = req.params;
        const currentUserId = req.user._id || req.user.id;

        const conversation = await Conversation.findById(Number(id));

        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        // RBAC: Only participants can view the conversation
        if (!conversation.participants.includes(currentUserId)) {
            return res.status(403).json({
                error: "You don't have permission to view this conversation"
            });
        }

        res.json(conversation);
    } catch (error) {
        next(error);
    }
});

// Get all conversations for current user
conversations.get("/", requireAuth, async (req, res, next) => {
    try {
        const currentUserId = req.user._id || req.user.id;

        const userConversations = await Conversation.find({
            participants: currentUserId
        })
            .sort({ lastMessageAt: -1 })
            .populate('participants', 'name email');

        res.json(userConversations);
    } catch (error) {
        next(error);
    }
});

// Get conversation between current user and another user
conversations.get("/with/:userId", requireAuth, async (req, res, next) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user._id || req.user.id;

        if (Number(userId) === currentUserId) {
            return res.status(400).json({ error: "Cannot get conversation with yourself" });
        }

        const conversation = await Conversation.findOne({
            participants: { $all: [currentUserId, Number(userId)] }
        });

        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        // RBAC check is implicit since we're searching by currentUserId
        res.json(conversation);
    } catch (error) {
        next(error);
    }
});
