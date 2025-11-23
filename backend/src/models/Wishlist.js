import mongoose from "mongoose";
import { getNextId } from "../db/counter.js";

const WishlistSchema = new mongoose.Schema(
    {
        _id: {
            type: Number,
        },
        userId: {
            type: Number,
            ref: "User",
            required: true,
        },
        dormId: {
            type: Number,
            ref: "Dorm",
            required: true,
        },
    },
    {
        timestamps: true,
        collection: "wishlists",
    }
);

// Compound index for unique user-dorm combination
WishlistSchema.index({ userId: 1, dormId: 1 }, { unique: true });

// Auto-increment _id before saving
WishlistSchema.pre("save", async function (next) {
    if (this.isNew && !this._id) {
        try {
            this._id = await getNextId("wishlists");
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

export const Wishlist = mongoose.model("Wishlist", WishlistSchema);
