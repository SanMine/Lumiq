import mongoose from "mongoose";
import { getNextId } from "../db/counter.js";

const BookingSchema = new mongoose.Schema(
  {
    _id: { type: Number },
    userId: { type: Number, ref: "User", required: true },
    dormId: { type: Number, ref: "Dorm", required: true },
    roomId: { type: Number, ref: "Room", required: true },
    moveInDate: { type: Date, default: null },
    stayDuration: { type: String, default: "" },
    term_stay: { type: String, default: "" },
    dormType: { type: String, enum: ["Male Dorm", "Female Dorm"], default: "Male Dorm" },
    durationType: { type: String, enum: ["months", "years"], default: "months" },
    paymentMethod: { type: String, enum: ["card", "qr", "slip"], default: "card" },
    paymentSlipUrl: { type: String, default: null },
    bookingFeePaid: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    status: { type: String, enum: ["Pending", "Confirmed", "Cancelled"], default: "Pending" },
  },
  {
    timestamps: true,
    collection: "bookings",
  }
);

// Auto-increment numeric ID like other models
BookingSchema.pre("save", async function (next) {
  if (!this._id) {
    try {
      this._id = await getNextId("bookings");
    } catch (err) {
      return next(err);
    }
  }
  next();
});

export const Booking = mongoose.model("Booking", BookingSchema);
