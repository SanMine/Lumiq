import mongoose from "mongoose";
import { getNextId } from "../db/counter.js";

const UserPersonalitySchema = new mongoose.Schema(
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
    nickname: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: [
        "Male",
        "Female",
        "Non-binary",
        "Prefer not to say",
      ],
      default: "Prefer not to say",
    },
    nationality: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    contact: {
      type: String,
      default: null,
    },
    sleep_schedule: {
      type: String,
      default: null,
      comment: "Preferred sleep time",
    },
    lifestyle: {
      type: [String],
      default: [],
    },
    sleep_type: {
      type: String,
      enum: ["Early Bird", "Night Owl", "Flexible"],
      default: "Flexible",
    },
    study_habits: {
      type: String,
      enum: ["silent", "some_noise", "flexible"],
      default: "flexible",
    },
    cleanliness: {
      type: String,
      enum: ["Tidy", "Moderate", "Messy"],
      default: "Moderate",
    },
    social: {
      type: String,
      enum: ["Quiet", "Social", "Moderate"],
      default: "Moderate",
    },
    MBTI: {
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
      ],
      default: null,
    },
    going_out: {
      type: String,
      enum: ["Homebody", "Occasional", "Frequent"],
      default: "Occasional",
    },
    smoking: {
      type: Boolean,
      default: false,
    },
    drinking: {
      type: String,
      enum: ["Never", "Occasional", "Frequent"],
      default: "Never",
    },
    pets: {
      type: String,
      enum: [
        "No Pets",
        "Allergic",
        "Pet Owner",
        "Pet Friendly",
        "Cat Person",
        "Dog Person",
        "Dog & Cat Person",
        "Flexible",
        "Do not like pets",
      ],
      default: "Flexible",
    },
    noise_tolerance: {
      type: String,
      enum: ["Low", "Medium", "High", "Flexible"],
      default: "Flexible",
    },
    temperature: {
      type: String,
      enum: ["Cold", "Cool", "Warm", "Hot", "Flexible"],
      default: "Flexible",
    },
  },
  {
    timestamps: true,
    collection: "personalities",
  }
);

// Auto-increment ID
UserPersonalitySchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      this._id = await getNextId("personalities");
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

export const User_personality = mongoose.model(
  "User_personality",
  UserPersonalitySchema
);

