import mongoose from "mongoose";

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
  },
  {
    timestamps: true,
    collection: "ratings",
  }
);

// Add compound index for unique rating per user per dorm
RatingSchema.index({ userId: 1, dormId: 1 }, { unique: true });

export const Rating = mongoose.model("Rating", RatingSchema);