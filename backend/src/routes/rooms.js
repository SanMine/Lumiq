import { Router } from "express";
import { RoomService } from "../services/roomService.js";

export const rooms = Router();

rooms.get("/", async (req, res, next) => {
  try {
    const { dormId } = req.query;
    if (dormId) {
      const roomsByDorm = await RoomService.getRoomsByDorm(dormId);
      res.json(roomsByDorm);
    } else {
      const allRooms = await RoomService.getAllRooms();
      res.json(allRooms);
    }
  } catch (error) {
    next(error);
  }
});

rooms.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const room = await RoomService.getRoomById(id);
    res.json(room);
  } catch (error) {
    next(error);
  }
});

rooms.post("/", async (req, res, next) => {
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

rooms.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedRoom = await RoomService.updateRoom(id, updateData);
    res.json(updatedRoom);
  } catch (error) {
    next(error);
  }
});

rooms.patch("/:id/availability", async (req, res, next) => {
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

rooms.post("/:id/reserve", async (req, res, next) => {
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

rooms.post("/:id/move-in", async (req, res, next) => {
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

rooms.patch("/:id/move-out-date", async (req, res, next) => {
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

rooms.post("/:id/move-out", async (req, res, next) => {
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

rooms.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await RoomService.deleteRoom(id);
    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    next(error);
  }
});

rooms.get("/dorm/:dormId/statistics", async (req, res, next) => {
  try {
    const { dormId } = req.params;
    const stats = await RoomService.getDormRoomStatistics(dormId);
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

rooms.get("/dorm/:dormId/by-floor", async (req, res, next) => {
  try {
    const { dormId } = req.params;
    const roomsByFloor = await RoomService.getRoomsByFloor(dormId);
    res.json(roomsByFloor);
  } catch (error) {
    next(error);
  }
});

rooms.get("/upcoming-available/:days", async (req, res, next) => {
  try {
    const { days } = req.params;
    const upcomingRooms = await RoomService.getUpcomingAvailableRooms(parseInt(days));
    res.json(upcomingRooms);
  } catch (error) {
    next(error);
  }
});