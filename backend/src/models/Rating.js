import mongoose from "mongoose";
import { getNextId } from "../db/counter.js";

const RatingSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
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
    comment: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: "ratings",
  }
);

// Add compound index for unique rating per user per dorm
RatingSchema.index({ userId: 1, dormId: 1 }, { unique: true });

// Auto-increment _id before saving
RatingSchema.pre("save", async function (next) {
  if (this.isNew && !this._id) {
    try {
      this._id = await getNextId("ratings");
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

export const Rating = mongoose.model("Rating", RatingSchema);