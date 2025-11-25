import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { setActiveChatSession, clearActiveChatSession, getActiveConversations } from "../utils/activeChatSessions.js";

export const chatSessions = Router();

/**
 * Mark a conversation as actively open for the current user
 * POST /chat-sessions/active
 * Body: { conversationId: number }
 */
chatSessions.post("/active", requireAuth, async (req, res, next) => {
    try {
        const { conversationId } = req.body;
        const currentUserId = req.user._id || req.user.id;

        if (!conversationId) {
            return res.status(400).json({ error: "conversationId is required" });
        }

        setActiveChatSession(currentUserId, Number(conversationId));

        res.json({
            success: true,
            message: "Chat session marked as active",
            userId: currentUserId,
            conversationId: Number(conversationId)
        });
    } catch (error) {
        next(error);
    }
});

/**
 * Mark a conversation as closed/inactive for the current user
 * DELETE /chat-sessions/active/:conversationId
 */
chatSessions.delete("/active/:conversationId", requireAuth, async (req, res, next) => {
    try {
        const { conversationId } = req.params;
        const currentUserId = req.user._id || req.user.id;

        clearActiveChatSession(currentUserId, Number(conversationId));

        res.json({
            success: true,
            message: "Chat session marked as inactive",
            userId: currentUserId,
            conversationId: Number(conversationId)
        });
    } catch (error) {
        next(error);
    }
});

/**
 * Get all active conversations for the current user
 * GET /chat-sessions/active
 */
chatSessions.get("/active", requireAuth, async (req, res, next) => {
    try {
        const currentUserId = req.user._id || req.user.id;
        const activeConversations = getActiveConversations(currentUserId);

        res.json({
            userId: currentUserId,
            activeConversations
        });
    } catch (error) {
        next(error);
    }
});
