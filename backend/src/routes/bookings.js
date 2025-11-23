import { Router } from "express";
import { Booking } from "../models/Booking.js";
import { RoomService } from "../services/roomService.js";
import { requireAuth, requireStudent } from "../middlewares/auth.js";
import multer from "multer";
import { join, dirname } from "path";
import fs from "fs";
import { fileURLToPath } from "url";

export const bookings = Router();

// Ensure uploads directory exists for payment slips — resolve relative to this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadsDir = join(__dirname, "..", "uploads", "bookings");
fs.mkdirSync(uploadsDir, { recursive: true });

// Multer setup
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (_req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const safeName = file.originalname.replace(/[\s]/g, "-");
    cb(null, `${unique}-${safeName}`);
  },
});

const upload = multer({ storage });

// Create a booking (students only) — accepts optional file upload (field: paymentSlip)
bookings.post("/", requireStudent, upload.single("paymentSlip"), async (req, res, next) => {
  try {
    // Accept both canonical field names and a few alternate aliases from clients
    const {
      dormId,
      roomId,
      moveInDate,
      stayDuration,
      durationType,
      paymentMethod,
      bookingFeePaid,
      totalAmount,
      // alternate aliases
      booking_fees,
      expected_move_in_date,
      booked_date,
      booked_time,
    } = req.body;

    if (!dormId || !roomId) {
      return res.status(400).json({ error: "dormId and roomId are required" });
    }

    const paymentSlipUrl = req.file ? `/uploads/bookings/${req.file.filename}` : req.body.paymentSlipUrl || null;

    // Map aliases to canonical values
    const bookingFeeValue = (bookingFeePaid !== undefined ? bookingFeePaid : booking_fees) || 0;
    const moveInValue = moveInDate || expected_move_in_date || null;

    // If client provided booked_date and booked_time we can set createdAt accordingly
    let createdAt = undefined;
    if (booked_date) {
      try {
        // combine date and optional time into ISO string when possible
        const timePart = booked_time || '00:00:00';
        const iso = new Date(`${booked_date}T${timePart}`);
        if (!isNaN(iso.getTime())) createdAt = iso;
      } catch (e) {
        // ignore parse errors and let mongoose set createdAt
      }
    }

    const createPayload = {
      userId: req.user.id,
      dormId,
      roomId,
      moveInDate: moveInValue ? new Date(moveInValue) : null,
      stayDuration: stayDuration ? Number(stayDuration) : 0,
      durationType: durationType || "months",
      paymentMethod: paymentMethod || "card",
      paymentSlipUrl,
      bookingFeePaid: bookingFeeValue ? Number(bookingFeeValue) : 0,
      totalAmount: totalAmount ? Number(totalAmount) : 0,
      status: "Pending",
    };

    if (createdAt) createPayload.createdAt = createdAt;

    const newBooking = await Booking.create(createPayload);

    // Try to reserve the room for this user immediately. This uses RoomService which
    // performs necessary checks (room exists, available). If reservation succeeds,
    // update booking status to Confirmed.
    try {
      await RoomService.reserveRoom(roomId, req.user.id, createPayload.moveInDate);
      newBooking.status = "Confirmed";
      await newBooking.save();
    } catch (reserveErr) {
      // If reservation fails, keep booking as Pending. Do not block booking creation.
      console.warn("Room reservation after booking creation failed:", reserveErr?.message || reserveErr);
    }

    res.status(201).json(newBooking);
  } catch (err) {
    next(err);
  }
});

// Get list of bookings
bookings.get("/", requireAuth, async (req, res, next) => {
  try {
    // Admins can see all bookings, others see only their own
    if (req.user.role === "admin") {
      const all = await Booking.find().sort({ _id: -1 });
      return res.json(all);
    }
    const mine = await Booking.find({ userId: req.user.id }).sort({ _id: -1 });
    res.json(mine);
  } catch (err) {
    next(err);
  }
});

// Get single booking (protected) — only owner or admin
bookings.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    const isOwner = String(booking.userId) === String(req.user.id);
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(booking);
  } catch (err) {
    next(err);
  }
});

// Update booking status (admin or owner) - partial update
bookings.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    const isOwner = String(booking.userId) === String(req.user.id);
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const allowed = [
      "moveInDate",
      "stayDuration",
      "durationType",
      "paymentMethod",
      "paymentSlipUrl",
      "bookingFeePaid",
      "totalAmount",
      "status",
    ];

    for (const key of allowed) {
      if (req.body[key] !== undefined) booking[key] = req.body[key];
    }

    await booking.save();
    res.json(booking);
  } catch (err) {
    next(err);
  }
});
