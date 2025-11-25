import { Router } from "express";
import { Message } from "../models/Message.js";
import { Conversation } from "../models/Conversation.js";
import { Notification } from "../models/Notification.js";
import { requireAuth, requireStudent } from "../middlewares/auth.js";
import { isConversationActive } from "../utils/activeChatSessions.js";

export const messages = Router();

// Send a message
messages.post("/", requireStudent, async (req, res, next) => {
    try {
        const { conversationId, text } = req.body;
        const currentUserId = req.user._id || req.user.id;

        if (!conversationId || !text) {
            return res.status(400).json({ error: "conversationId and text are required" });
        }

        // Verify conversation exists
        const conversation = await Conversation.findById(Number(conversationId));

        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        // RBAC: Only participants can send messages
        if (!conversation.participants.includes(currentUserId)) {
            return res.status(403).json({
                error: "You don't have permission to send messages in this conversation"
            });
        }

        // Create message
        const newMessage = await Message.create({
            conversationId: Number(conversationId),
            sender: currentUserId,
            text: text.trim(),
            readBy: [currentUserId] // Sender has read their own message
        });

        // Update conversation's last message
        conversation.lastMessage = text.trim();
        conversation.lastMessageAt = new Date();
        await conversation.save();

        // Populate sender info before sending response
        await newMessage.populate('sender', 'name email');

        // Create or update notification for the recipient
        try {
            // Get recipient ID (the other participant in the conversation)
            const recipientId = conversation.participants.find(p => p !== currentUserId);

            if (recipientId) {
                // Check if recipient has this conversation actively open
                const isChatActive = isConversationActive(recipientId, conversation._id);

                if (isChatActive) {
                    console.log(`🔕 Notification suppressed: User ${recipientId} has conversation ${conversation._id} actively open`);
                } else {
                    // Check for existing notification
                    let notification = await Notification.findOne({
                        recipientId: recipientId,
                        type: "message",
                        "data.senderId": currentUserId
                    });

                    if (notification) {
                        // Update existing notification
                        notification.title = `New message from ${newMessage.sender.name}`;
                        notification.message = newMessage.text;
                        notification.read = false;
                        notification.data = {
                            conversationId: conversation._id,
                            messageId: newMessage._id,
                            senderId: currentUserId
                        };
                        await notification.save();
                        console.log("✅ Message notification updated:", notification);
                    } else {
                        // Create new notification (triggers pre-save hook for ID)
                        notification = await Notification.create({
                            recipientId: recipientId,
                            type: "message",
                            title: `New message from ${newMessage.sender.name}`,
                            message: newMessage.text,
                            read: false,
                            data: {
                                conversationId: conversation._id,
                                messageId: newMessage._id,
                                senderId: currentUserId
                            }
                        });
                        console.log("✅ Message notification created:", notification);
                    }
                }
            }
        } catch (notifError) {
            console.error("❌ Failed to create/update message notification:", notifError);
            // Don't fail the whole request if notification fails
        }

        res.status(201).json(newMessage);
    } catch (error) {
        next(error);
    }
});

// Get messages for a conversation
messages.get("/:conversationId", requireAuth, async (req, res, next) => {
    try {
        const { conversationId } = req.params;
        const currentUserId = req.user._id || req.user.id;
        const { limit = 50, before } = req.query;

        // Verify conversation exists
        const conversation = await Conversation.findById(Number(conversationId));

        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        // RBAC: Only participants can view messages
        if (!conversation.participants.includes(currentUserId)) {
            return res.status(403).json({
                error: "You don't have permission to view messages in this conversation"
            });
        }

        // Build query
        const query = { conversationId: Number(conversationId) };

        // Add pagination support
        if (before) {
            query._id = { $lt: Number(before) };
        }

        // Fetch messages
        const conversationMessages = await Message.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .populate('sender', 'name email');

        // Mark messages as read by current user
        const unreadMessageIds = conversationMessages
            .filter(msg => !msg.readBy.includes(currentUserId))
            .map(msg => msg._id);

        if (unreadMessageIds.length > 0) {
            await Message.updateMany(
                { _id: { $in: unreadMessageIds } },
                { $addToSet: { readBy: currentUserId } }
            );
        }

        res.json(conversationMessages.reverse()); // Return in chronological order
    } catch (error) {
        next(error);
    }
});

// Mark message as read
messages.put("/:messageId/read", requireAuth, async (req, res, next) => {
    try {
        const { messageId } = req.params;
        const currentUserId = req.user._id || req.user.id;

        const message = await Message.findById(Number(messageId));

        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }

        // Verify user is a participant in the conversation
        const conversation = await Conversation.findById(message.conversationId);

        if (!conversation || !conversation.participants.includes(currentUserId)) {
            return res.status(403).json({
                error: "You don't have permission to mark this message as read"
            });
        }

        // Add user to readBy if not already there
        if (!message.readBy.includes(currentUserId)) {
            message.readBy.push(currentUserId);
            await message.save();
        }

        res.json(message);
    } catch (error) {
        next(error);
    }
});
