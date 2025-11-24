import mongoose from "mongoose";
import { getNextId } from "../db/counter.js";

const NotificationSchema = new mongoose.Schema(
    {
        _id: {
            type: Number,
        },
        recipientId: {
            type: Number,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: ["knock", "match", "system", "message", "alert"],
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        read: {
            type: Boolean,
            default: false,
        },
        data: {
            type: mongoose.Schema.Types.Mixed, // Store related ID (e.g., knockId, senderId)
            default: {},
        },
    },
    {
        timestamps: true,
        collection: "notifications",
    }
);

// Auto-increment ID
NotificationSchema.pre("save", async function (next) {
    if (this.isNew) {
        try {
            this._id = await getNextId("notifications");
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

export const Notification = mongoose.model("Notification", NotificationSchema);
