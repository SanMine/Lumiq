import { Router } from "express";
import { RoomService } from "../services/roomService.js";

export const rooms = Router();

// Get all rooms or filter by dorm
rooms.get("/", async (req, res) => {
  try {
    const { dormId } = req.query;
    
    if (dormId) {
      const roomsByDorm = await RoomService.getRoomsByDorm(parseInt(dormId));
      res.json(roomsByDorm);
    } else {
      const allRooms = await RoomService.getAllRooms();
      res.json(allRooms);
    }
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ 
      error: "Failed to fetch rooms",
      message: error.message 
    });
  }
});

// Get specific room by ID
rooms.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const room = await RoomService.getRoomById(parseInt(id));
    res.json(room);
  } catch (error) {
    console.error("Error fetching room:", error);
    res.status(404).json({ 
      error: "Room not found",
      message: error.message 
    });
  }
});

// Create new room
rooms.post("/", async (req, res) => {
  try {
    const roomData = req.body;
    
    // Validate required fields
    if (!roomData.dormId || !roomData.room_number || !roomData.price_per_month) {
      return res.status(400).json({ 
        error: "Missing required fields",
        message: "dormId, room_number, and price_per_month are required" 
      });
    }

    const newRoom = await RoomService.createRoom(roomData.dormId, roomData);
    res.status(201).json(newRoom);
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(400).json({ 
      error: "Failed to create room",
      message: error.message 
    });
  }
});

// Update room
rooms.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedRoom = await RoomService.updateRoom(parseInt(id), updateData);
    res.json(updatedRoom);
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(400).json({ 
      error: "Failed to update room",
      message: error.message 
    });
  }
});

// Update room availability
rooms.patch("/:id/availability", async (req, res) => {
  try {
    const { id } = req.params;
    const { available } = req.body;
    
    if (typeof available !== 'boolean') {
      return res.status(400).json({ 
        error: "Invalid data",
        message: "Available must be a boolean value" 
      });
    }

    const updatedRoom = await RoomService.updateRoomAvailability(parseInt(id), available);
    res.json(updatedRoom);
  } catch (error) {
    console.error("Error updating room availability:", error);
    res.status(400).json({ 
      error: "Failed to update room availability",
      message: error.message 
    });
  }
});

// Reserve room
rooms.post("/:id/reserve", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, moveInDate } = req.body;
    
    if (!userId) {
      return res.status(400).json({ 
        error: "Missing required fields",
        message: "userId is required" 
      });
    }

    const reservedRoom = await RoomService.reserveRoom(parseInt(id), userId, moveInDate);
    res.json(reservedRoom);
  } catch (error) {
    console.error("Error reserving room:", error);
    res.status(400).json({ 
      error: "Failed to reserve room",
      message: error.message 
    });
  }
});

// Move student in (Reserved → Occupied)
rooms.post("/:id/move-in", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ 
        error: "Missing required fields",
        message: "userId is required" 
      });
    }

    const updatedRoom = await RoomService.moveStudentIn(parseInt(id), userId);
    res.json(updatedRoom);
  } catch (error) {
    console.error("Error moving student in:", error);
    res.status(400).json({ 
      error: "Failed to move student in",
      message: error.message 
    });
  }
});

// Set move-out date
rooms.patch("/:id/move-out-date", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, moveOutDate } = req.body;
    
    if (!userId || !moveOutDate) {
      return res.status(400).json({ 
        error: "Missing required fields",
        message: "userId and moveOutDate are required" 
      });
    }

    const updatedRoom = await RoomService.setMoveOutDate(parseInt(id), userId, moveOutDate);
    res.json(updatedRoom);
  } catch (error) {
    console.error("Error setting move-out date:", error);
    res.status(400).json({ 
      error: "Failed to set move-out date",
      message: error.message 
    });
  }
});

// Move student out (Occupied → Available)
rooms.post("/:id/move-out", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ 
        error: "Missing required fields",
        message: "userId is required" 
      });
    }

    const updatedRoom = await RoomService.moveStudentOut(parseInt(id), userId);
    res.json(updatedRoom);
  } catch (error) {
    console.error("Error moving student out:", error);
    res.status(400).json({ 
      error: "Failed to move student out",
      message: error.message 
    });
  }
});

// Delete room
rooms.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await RoomService.deleteRoom(parseInt(id));
    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(400).json({ 
      error: "Failed to delete room",
      message: error.message 
    });
  }
});

// Get room statistics for a dorm
rooms.get("/dorm/:dormId/statistics", async (req, res) => {
  try {
    const { dormId } = req.params;
    const stats = await RoomService.getDormRoomStatistics(parseInt(dormId));
    res.json(stats);
  } catch (error) {
    console.error("Error fetching room statistics:", error);
    res.status(500).json({ 
      error: "Failed to fetch room statistics",
      message: error.message 
    });
  }
});

// Get rooms by floor for a dorm
rooms.get("/dorm/:dormId/by-floor", async (req, res) => {
  try {
    const { dormId } = req.params;
    const roomsByFloor = await RoomService.getRoomsByFloor(parseInt(dormId));
    res.json(roomsByFloor);
  } catch (error) {
    console.error("Error fetching rooms by floor:", error);
    res.status(500).json({ 
      error: "Failed to fetch rooms by floor",
      message: error.message 
    });
  }
});

// Get upcoming available rooms
rooms.get("/upcoming-available/:days", async (req, res) => {
  try {
    const { days } = req.params;
    const upcomingRooms = await RoomService.getUpcomingAvailableRooms(parseInt(days));
    res.json(upcomingRooms);
  } catch (error) {
    console.error("Error fetching upcoming available rooms:", error);
    res.status(500).json({ 
      error: "Failed to fetch upcoming available rooms",
      message: error.message 
    });
  }
});