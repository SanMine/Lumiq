import mongoose from "mongoose";
import { getNextId } from "../db/counter.js";

const RoomSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
    },
    dormId: {
      type: Number,
      ref: "Dorm",
      required: true,
    },
    room_number: {
      type: String,
      required: true,
    },
    room_type: {
      type: String,
      enum: ["Single", "Double", "Triple"],
      default: "Single",
    },
    capacity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
      max: 3,
    },
    price_per_month: {
      type: Number,
      required: true,
    },
    floor: {
      type: Number,
      required: true,
      default: 1,
    },
    description: {
      type: String,
      default: null,
    },
    zone: {
      type: String,
      default: null,
      comment: "Building or zone identifier (e.g., Building A, Zone 2)",
    },
    amenities: {
      type: String,
      default: null,
    },
    images: {
      type: [String],
      default: [],
      comment: "Array of image URLs",
    },
    status: {
      type: String,
      enum: ["Available", "Reserved", "Occupied", "Maintenance"],
      default: "Available",
    },
    current_resident_id: {
      type: Number,
      ref: "User",
      default: null,
    },
    expected_move_in_date: {
      type: Date,
      default: null,
      comment: "Expected date when new tenant will move in",
    },
    expected_available_date: {
      type: Date,
      default: null,
      comment: "Expected date when room will become available (move out date)",
    },
  },
  {
    timestamps: true,
    collection: "rooms",
  }
);

// Add compound index for unique room_number per dorm
RoomSchema.index({ room_number: 1, dormId: 1 }, { unique: true });

// Pre-save hook to auto-increment _id
RoomSchema.pre("save", async function (next) {
  if (!this._id) {
    try {
      this._id = await getNextId("rooms");
    } catch (error) {
      return next(error);
    }
  }
  next();
});

export const Room = mongoose.model("Room", RoomSchema);