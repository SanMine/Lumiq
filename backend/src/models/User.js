import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { getNextId } from "../db/counter.js";

const UserSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: false,
      select: false, // 🔒 Exclude password by default
    },
    role: {
      type: String,
      enum: ["student", "dorm_admin"],
      default: "student",
    },
    phone: {
      type: String,
      default: "",
    },
    dateOfBirth: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    dormId: {
      type: Number,
      ref: "Dorm",
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

// 🔢 Auto-increment ID
UserSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      this._id = await getNextId("users");
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// 🔐 Password hashing middleware
UserSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) {
    return next();
  }

  // Skip hashing if passwordHash is null (for Google OAuth users)
  if (this.passwordHash === null) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 🔍 Compare password method
UserSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

// 🧪 Static helper functions
UserSchema.statics.hashPassword = async function (plainPassword) {
  const scrambledPassword = await bcrypt.hash(plainPassword, 12);
  return scrambledPassword;
};

UserSchema.statics.checkPassword = async function (plainPassword, hashedPassword) {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatch;
};

UserSchema.statics.findByEmailWithPassword = async function (email) {
  const user = await this.findOne({ email: email.toLowerCase() }).select("+passwordHash");
  return user;
};

export const User = mongoose.model("User", UserSchema);