import mongoose from "mongoose";
import { getNextId } from "../db/counter.js";

const AiMatchResultSchema = new mongoose.Schema(
    {
        _id: {
            type: Number,
        },
        pairHash: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        user1Id: {
            type: Number,
            required: true,
            ref: "User",
        },
        user2Id: {
            type: Number,
            required: true,
            ref: "User",
        },
        compatibilityScore: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        verdict: {
            type: String,
            required: true,
        },
        spark: {
            type: String,
            required: true,
        },
        friction: {
            type: String,
            required: true,
        },
        strengths: [
            {
                category: String,
                explanation: String,
            },
        ],
        concerns: [
            {
                category: String,
                explanation: String,
            },
        ],
        summary: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        collection: "ai_match_results",
    }
);

// Auto-increment ID
AiMatchResultSchema.pre("save", async function (next) {
    if (this.isNew) {
        try {
            this._id = await getNextId("ai_match_results");
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

// TTL index - auto-delete after 7 days
AiMatchResultSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 }); // 7 days

export const AiMatchResult = mongoose.model("AiMatchResult", AiMatchResultSchema);
