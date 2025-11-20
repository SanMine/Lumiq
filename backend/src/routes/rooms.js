import { Router } from "express";
import { RoomService } from "../services/roomService.js";
import { requireAuth, requireDormAdmin } from "../middlewares/auth.js";

export const rooms = Router();

// Get all rooms or filter by dormId
rooms.get("/", requireAuth, async (req, res, next) => {
  try {
    const { dormId } = req.query;
    if (dormId) {
      const roomsByDorm = await RoomService.getRoomsByDorm(dormId);
      res.json(roomsByDorm);
    } else {
      // pass any query filters (e.g., zone, status) through to the service
      const filters = req.query || {};
      const allRooms = await RoomService.getAllRooms(filters);
      res.json(allRooms);
    }
  } catch (error) {
    next(error);
  }
});

// Get single room by ID
rooms.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const room = await RoomService.getRoomById(id);
    res.json(room);
  } catch (error) {
    next(error);
  }
});

// Create new room - RBAC: Only dorm_admin can create
rooms.post("/", requireAuth, requireDormAdmin, async (req, res, next) => {
  try {
    const roomData = req.body;
    if (!roomData.dormId || !roomData.room_number || !roomData.price_per_month) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "dormId, room_number, and price_per_month are required",
      });
    }
    const newRoom = await RoomService.createRoom(roomData.dormId, roomData);
    res.status(201).json(newRoom);
  } catch (error) {
    next(error);
  }
});

// Update room - RBAC: Only dorm_admin can update
rooms.put("/:id", requireAuth, requireDormAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedRoom = await RoomService.updateRoom(id, updateData);
    res.json(updatedRoom);
  } catch (error) {
    next(error);
  }
});

// Update room availability - RBAC: Only dorm_admin can update
rooms.patch("/:id/availability", requireAuth, requireDormAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { available } = req.body;
    if (typeof available !== "boolean") {
      return res.status(400).json({
        error: "Invalid data",
        message: "Available must be a boolean value",
      });
    }
    const updatedRoom = await RoomService.updateRoomAvailability(id, available);
    res.json(updatedRoom);
  } catch (error) {
    next(error);
  }
});

// Reserve room - RBAC: Only dorm_admin can reserve
rooms.post("/:id/reserve", requireAuth, requireDormAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId, moveInDate } = req.body;
    if (!userId) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "userId is required",
      });
    }
    const reservedRoom = await RoomService.reserveRoom(id, userId, moveInDate);
    res.json(reservedRoom);
  } catch (error) {
    next(error);
  }
});

// Move student in - RBAC: Only dorm_admin can move in
rooms.post("/:id/move-in", requireAuth, requireDormAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "userId is required",
      });
    }
    const updatedRoom = await RoomService.moveStudentIn(id, userId);
    res.json(updatedRoom);
  } catch (error) {
    next(error);
  }
});

// Set move-out date - RBAC: Only dorm_admin can set
rooms.patch("/:id/move-out-date", requireAuth, requireDormAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId, moveOutDate } = req.body;
    if (!userId || !moveOutDate) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "userId and moveOutDate are required",
      });
    }
    const updatedRoom = await RoomService.setMoveOutDate(id, userId, moveOutDate);
    res.json(updatedRoom);
  } catch (error) {
    next(error);
  }
});

// Move student out - RBAC: Only dorm_admin can move out
rooms.post("/:id/move-out", requireAuth, requireDormAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "userId is required",
      });
    }
    const updatedRoom = await RoomService.moveStudentOut(id, userId);
    res.json(updatedRoom);
  } catch (error) {
    next(error);
  }
});

// Delete room - RBAC: Only dorm_admin can delete
rooms.delete("/:id", requireAuth, requireDormAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    await RoomService.deleteRoom(id);
    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    next(error);
  }
});

// Get dorm room statistics
rooms.get("/dorm/:dormId/statistics", requireAuth, async (req, res, next) => {
  try {
    const { dormId } = req.params;
    const stats = await RoomService.getDormRoomStatistics(dormId);
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

// Get rooms by floor for a dorm
rooms.get("/dorm/:dormId/by-floor", requireAuth, async (req, res, next) => {
  try {
    const { dormId } = req.params;
    const roomsByFloor = await RoomService.getRoomsByFloor(dormId);
    res.json(roomsByFloor);
  } catch (error) {
    next(error);
  }
});

// Get upcoming available rooms
rooms.get("/upcoming-available/:days", requireAuth, async (req, res, next) => {
  try {
    const { days } = req.params;
    const upcomingRooms = await RoomService.getUpcomingAvailableRooms(parseInt(days));
    res.json(upcomingRooms);
  } catch (error) {
    next(error);
  }
});
