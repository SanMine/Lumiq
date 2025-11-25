import mongoose from "mongoose";
import { getNextId } from "../db/counter.js";

const MessageSchema = new mongoose.Schema(
    {
        _id: {
            type: Number,
        },
        conversationId: {
            type: Number,
            ref: "Conversation",
            required: true,
        },
        sender: {
            type: Number,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
            required: true,
            trim: true,
        },
        readBy: [
            {
                type: Number,
                ref: "User",
            },
        ],
    },
    {
        timestamps: true,
        collection: "messages",
    }
);

// 🔢 Auto-increment ID
MessageSchema.pre("save", async function (next) {
    if (this.isNew) {
        try {
            this._id = await getNextId("messages");
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

// Index for faster message retrieval
MessageSchema.index({ conversationId: 1, createdAt: -1 });

export const Message = mongoose.model("Message", MessageSchema);
