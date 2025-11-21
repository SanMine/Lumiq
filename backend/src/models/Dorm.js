//backend/src/models/Dorm.js
import mongoose from "mongoose";

const DormSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    image_url: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    availibility: {
      type: Boolean,
      default: true,
    },
    facilities: {
      type: String,
      default: null,
    },
    price: {
      type: Number,
      default: null,
    },
    insurance_policy: {
      type: Number,
      default: null,
    },
    Water_fee: {
      type: Number,
      default: null,
    },
    Electricity_fee: {
      type: Number,
      default: null,
    },
    waterBillingType: {
      type: String,
      enum: ['per-month', 'per-unit'],
      default: 'per-month',
    },
    electricityBillingType: {
      type: String,
      enum: ['per-month', 'per-unit'],
      default: 'per-month',
    },
    admin_id: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "dorms",
  }
);

export const Dorm = mongoose.model("Dorm", DormSchema);