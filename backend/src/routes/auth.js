// 🏢 AUTHENTICATION FRONT DESK - Where people register and login
import { Router } from "express";
import { User } from "../models/User.js";
import { generateToken } from "../utils/auth.js";
import { requireAuth } from "../middlewares/auth.js";

export const auth = Router();

// '/register'
// 📝 REGISTER: Create a new user account
auth.post("/register", async (req, res, next) => {
  try {
    const { email, name, password, role } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json({
        error: "All fields are required.",
        message: "Please provide email, name, and password.",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        error: "Password too short.",
        message: "Password must be at least 6 characters.",
      });
    }
    if (!email.includes("@")) {
      return res.status(400).json({
        error: "Invalid email.",
        message: "Please provide a valid email address.",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        error: "User already exists.",
        message: "Please use a different email address.",
      });
    }

    const hashedPassword = await User.hashPassword(password);
    const newUser = await User.create({
      email: email.toLowerCase(),
      name: name,
      passwordHash: hashedPassword,
      role: role || "student",
    });

    const token = generateToken(newUser);
    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
      token: token,
    });
  } catch (error) {
    next(error);
  }
});

// '/login'
// 📝 LOGIN: Authenticate user and get a token
auth.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        error: "All fields are required.",
        message: "Please provide email and password.",
      });
    }

    const user = await User.findByEmailWithPassword(email);
    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials.",
        message: "Email or password is incorrect.",
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid credentials.",
        message: "Email or password is incorrect.",
      });
    }

    const token = generateToken(user);
    res.json({
      success: true,
      message: "Login successful.",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token: token,
    });
  } catch (error) {
    next(error);
  }
});

// '/me' or '/current-user'
// 📝 GET CURRENT USER: Get info about the logged-in user
auth.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: "User not found.",
        message: "The logged-in user does not exist.",
      });
    }
    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

// '/update-profile'
// 🔐 UPDATE PROFILE: Allow logged-in users to update their profile
auth.put("/update-profile", requireAuth, async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: "User not found.",
        message: "The logged-in user does not exist.",
      });
    }

    if (email && email !== user.email) {
      const emailTaken = await User.findOne({ email: email.toLowerCase() });
      if (emailTaken) {
        return res.status(400).json({
          error: "Email already in use.",
          message: "Please use a different email address.",
        });
      }
      if (!email.includes("@")) {
        return res.status(400).json({
          error: "Invalid email.",
          message: "Please provide a valid email address.",
        });
      }
    }

    if (name) user.name = name.trim();
    if (email) user.email = email.toLowerCase().trim();
    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

// '/change-password'
// 🔐 CHANGE PASSWORD: Allow logged-in users to change their password
auth.put("/change-password", requireAuth, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: "All fields are required.",
        message: "Please provide current and new passwords.",
      });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({
        error: "Password too short.",
        message: "New password must be at least 6 characters.",
      });
    }

    const user = await User.findByEmailWithPassword(req.user.email);
    if (!user) {
      return res.status(404).json({
        error: "User not found.",
        message: "The logged-in user does not exist.",
      });
    }

    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        error: "Invalid current password.",
        message: "The current password is incorrect.",
      });
    }

    user.passwordHash = await User.hashPassword(newPassword);
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    next(error);
  }
});