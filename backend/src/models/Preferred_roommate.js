import mongoose from "mongoose";

const PreferredRoommateSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
    },
    userId: {
      type: Number,
      ref: "User",
      required: true,
      unique: true,
    },
    preferred_age_range: {
      type: {
        min: { type: Number, default: 18 },
        max: { type: Number, default: 30 },
      },
      default: { min: 18, max: 30 },
    },
    preferred_gender: {
      type: String,
      enum: [
        "Male",
        "Female",
        "Non-Binary",
        "Trans Male",
        "Trans Female",
        "Agender",
        "Genderqueer",
        "Any",
      ],
      default: "Any",
    },
    preferred_nationality: {
      type: String,
      default: null,
    },
    preferred_sleep_type: {
      type: String,
      enum: ["Early Bird", "Night Owl", "Any"],
      default: "Any",
    },
    preferred_smoking: {
      type: Boolean,
      default: false,
    },
    preferred_pets: {
      type: Boolean,
      default: false,
    },
    preferred_noise_tolerance: {
      type: String,
      enum: ["Low", "Medium", "High", "Flexible"],
      default: "Medium",
    },
    preferred_cleanliness: {
      type: String,
      enum: ["Tidy", "Moderate", "Messy"],
      default: "Moderate",
    },
    preferred_MBTI: {
      type: String,
      enum: [
        "INTJ",
        "INFP",
        "ENTJ",
        "ENFP",
        "ISTJ",
        "ISFJ",
        "ESTJ",
        "ESFJ",
        "ISTP",
        "ISFP",
        "ESTP",
        "ESFP",
        "INFJ",
        "INTP",
        "ENFJ",
        "ENTP",
        "Any",
      ],
      default: "Any",
    },
    preferred_temperature: {
      type: String,
      enum: ["Cold", "Cool", "Warm", "Hot", "Flexible"],
      default: "Flexible",
    },
    additional_preferences: {
      type: String,
      default: null,
    },
    preferred_dorms: {
      type: [Number],
      ref: "Dorm",
      default: [],
    },
  },
  {
    timestamps: true,
    collection: "preferred_roommate",
  }
);

export const Preferred_roommate = mongoose.model(
  "Preferred_roommate",
  PreferredRoommateSchema
);
