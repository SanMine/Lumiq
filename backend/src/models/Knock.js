import mongoose from "mongoose";
import { getNextId } from "../db/counter.js";

const KnockSchema = new mongoose.Schema(
    {
        _id: {
            type: Number,
        },
        senderId: {
            type: Number,
            ref: "User",
            required: true,
        },
        recipientId: {
            type: Number,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending",
        },
    },
    {
        timestamps: true,
        collection: "knocks",
    }
);

// Auto-increment ID
KnockSchema.pre("save", async function (next) {
    if (this.isNew) {
        try {
            this._id = await getNextId("knocks");
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

// Compound index to prevent duplicate knocks between same users
KnockSchema.index({ senderId: 1, recipientId: 1 }, { unique: true });

export const Knock = mongoose.model("Knock", KnockSchema);
