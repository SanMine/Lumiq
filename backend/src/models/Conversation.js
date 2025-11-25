import mongoose from "mongoose";
import { getNextId } from "../db/counter.js";

const ConversationSchema = new mongoose.Schema(
    {
        _id: {
            type: Number,
        },
        participants: [
            {
                type: Number,
                ref: "User",
                required: true,
            },
        ],
        lastMessage: {
            type: String,
            default: "",
        },
        lastMessageAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
        collection: "conversations",
    }
);

// 🔢 Auto-increment ID
ConversationSchema.pre("save", async function (next) {
    if (this.isNew) {
        try {
            this._id = await getNextId("conversations");
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

// Index for faster lookups
ConversationSchema.index({ participants: 1 });

export const Conversation = mongoose.model("Conversation", ConversationSchema);
