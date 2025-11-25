import { Router } from 'express';
import { Notification } from '../models/Notification.js';
import { requireAuth } from '../middlewares/auth.js';

export const notifications = Router();

// Get notifications for the authenticated user
notifications.get('/', requireAuth, async (req, res, next) => {
    try {
        const userId = req.user._id || req.user.id;
        console.log("📬 Fetching notifications for user:", userId);

        // Self-healing: Delete notifications with ObjectId _id (schema expects Number)
        // Type 7 is ObjectId. This cleans up notifications created by the bug.
        const cleanupResult = await Notification.collection.deleteMany({
            _id: { $type: 7 }
        });

        if (cleanupResult.deletedCount > 0) {
            console.log(`🧹 Cleaned up ${cleanupResult.deletedCount} invalid notifications (ObjectId _id)`);
        }

        const notifs = await Notification.find({ recipientId: userId })
            .sort({ createdAt: -1 });

        console.log(`📬 Found ${notifs.length} valid notifications for user ${userId}`);
        if (notifs.length > 0) {
            console.log("First notification sample:", JSON.stringify(notifs[0], null, 2));
        }
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

        console.log(`📝 Marking notification ${id} as read for user ${userId}`);

        const notif = await Notification.findById(Number(id));
        if (!notif) {
            console.log(`❌ Notification ${id} not found`);
            return res.status(404).json({ error: 'Notification not found' });
        }
        if (notif.recipientId !== userId) {
            return res.status(403).json({ error: "You don't have permission to modify this notification" });
        }
        notif.read = true;
        await notif.save();
        console.log(`✅ Notification ${id} marked as read`);
        res.json(notif);
    } catch (error) {
        console.error("❌ Error marking notification as read:", error);
        next(error);
    }
});

// Delete a notification
notifications.delete('/:id', requireAuth, async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user._id || req.user.id;

        console.log(`🗑️ Deleting notification ${id} for user ${userId}`);

        const notif = await Notification.findById(Number(id));
        if (!notif) {
            console.log(`❌ Notification ${id} not found`);
            return res.status(404).json({ error: 'Notification not found' });
        }
        if (notif.recipientId !== userId) {
            return res.status(403).json({ error: "You don't have permission to delete this notification" });
        }
        await Notification.findByIdAndDelete(Number(id));
        console.log(`✅ Notification ${id} deleted`);
        res.json({ message: 'Notification deleted successfully' });
    } catch (error) {
        console.error("❌ Error deleting notification:", error);
        next(error);
    }
});
