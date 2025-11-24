import { Router } from 'express';
import { Notification } from '../models/Notification.js';
import { requireAuth } from '../middlewares/auth.js';

export const notifications = Router();

// Get notifications for the authenticated user
notifications.get('/', requireAuth, async (req, res, next) => {
    try {
        const userId = req.user._id || req.user.id;
        console.log("📬 Fetching notifications for user:", userId);
        const notifs = await Notification.find({ recipientId: userId })
            .sort({ createdAt: -1 });
        console.log(`📬 Found ${notifs.length} notifications for user ${userId}`);
        res.json(notifs);
    } catch (error) {
        console.error("❌ Error fetching notifications:", error);
        next(error);
    }
});

// Mark a notification as read
notifications.put('/:id/read', requireAuth, async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user._id || req.user.id;
        const notif = await Notification.findById(id);
        if (!notif) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        if (notif.recipientId !== userId) {
            return res.status(403).json({ error: "You don't have permission to modify this notification" });
        }
        notif.read = true;
        await notif.save();
        res.json(notif);
    } catch (error) {
        next(error);
    }
});

// Delete a notification
notifications.delete('/:id', requireAuth, async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user._id || req.user.id;
        const notif = await Notification.findById(id);
        if (!notif) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        if (notif.recipientId !== userId) {
            return res.status(403).json({ error: "You don't have permission to delete this notification" });
        }
        await Notification.findByIdAndDelete(id);
        res.json({ message: 'Notification deleted successfully' });
    } catch (error) {
        next(error);
    }
});
