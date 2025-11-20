import { Room } from "../models/Room.js";
import { User } from "../models/User.js";
import { Dorm } from "../models/Dorm.js";
import { getNextId } from "../db/counter.js";

export class RoomService {
  static async getAllRooms(filters = {}) {
    try {
      let query = Room.find().populate("dormId").populate("current_resident_id");
      if (filters.dormId) query = query.where("dormId").equals(filters.dormId);
      if (filters.status) query = query.where("status").equals(filters.status);
      if (filters.zone) query = query.where("zone").equals(filters.zone);
      if (filters.room_type) query = query.where("room_type").equals(filters.room_type);
      if (filters.minPrice) query = query.where("price_per_month").gte(filters.minPrice);
      if (filters.maxPrice) query = query.where("price_per_month").lte(filters.maxPrice);
      const rooms = await query.sort({ dormId: 1, floor: 1, room_number: 1 });
      return rooms;
    } catch (error) {
      throw new Error(`Failed to get rooms: ${error.message}`);
    }
  }

  static async getRoomById(roomId) {
    try {
      const room = await Room.findById(roomId)
        .populate("dormId", "id name location facilities")
        .populate("current_resident_id", "id name email");
      if (!room) throw new Error("Room not found");
      return room;
    } catch (error) {
      throw new Error(`Failed to get room: ${error.message}`);
    }
  }

  static async getRoomsByDorm(dormId) {
    try {
      const rooms = await Room.find({ dormId })
        .populate("dormId")
        .populate("current_resident_id", "id name email")
        .sort({ floor: 1, room_number: 1 });
      return rooms;
    } catch (error) {
      throw new Error(`Failed to get rooms for dorm: ${error.message}`);
    }
  }

  static async createRoom(dormId, roomData) {
    try {
      const dorm = await Dorm.findById(dormId);
      if (!dorm) throw new Error("Dorm not found");
      
      // Generate auto-increment ID
      const _id = await getNextId("rooms");
      
      // Create room with explicit _id
      const newRoom = await Room.create({ _id, dormId, ...roomData });
      return await this.getRoomById(newRoom._id);
    } catch (error) {
      throw new Error(`Failed to create room: ${error.message}`);
    }
  }

  static async updateRoom(roomId, updateData) {
    try {
      const updatedRoom = await Room.findByIdAndUpdate(roomId, updateData, { new: true })
        .populate("dormId")
        .populate("current_resident_id");
      if (!updatedRoom) throw new Error("Room not found");
      return updatedRoom;
    } catch (error) {
      throw new Error(`Failed to update room: ${error.message}`);
    }
  }

  static async updateRoomAvailability(roomId, available) {
    try {
      const status = available ? "Available" : "Occupied";
      return await this.updateRoom(roomId, { status });
    } catch (error) {
      throw new Error(`Failed to update room availability: ${error.message}`);
    }
  }

  static async reserveRoom(roomId, userId, moveInDate) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");
      const room = await Room.findById(roomId);
      if (!room) throw new Error("Room not found");
      if (room.status !== "Available") throw new Error(`Room is not available (status: ${room.status})`);
      return await Room.findByIdAndUpdate(
        roomId,
        { status: "Reserved", current_resident_id: userId, expected_move_in_date: moveInDate },
        { new: true }
      ).populate("dormId").populate("current_resident_id");
    } catch (error) {
      throw new Error(`Failed to reserve room: ${error.message}`);
    }
  }

  static async moveStudentIn(roomId, userId) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");
      const room = await Room.findById(roomId);
      if (!room) throw new Error("Room not found");
      if (room.status !== "Reserved") throw new Error(`Room is not reserved (status: ${room.status})`);
      if (room.current_resident_id.toString() !== userId) throw new Error("User is not the one who reserved this room");
      return await Room.findByIdAndUpdate(roomId, { status: "Occupied" }, { new: true })
        .populate("dormId").populate("current_resident_id");
    } catch (error) {
      throw new Error(`Failed to move student in: ${error.message}`);
    }
  }

  static async setMoveOutDate(roomId, userId, moveOutDate) {
    try {
      const room = await Room.findById(roomId);
      if (!room) throw new Error("Room not found");
      if (room.current_resident_id.toString() !== userId) throw new Error("User is not the current resident");
      return await Room.findByIdAndUpdate(roomId, { expected_available_date: moveOutDate }, { new: true })
        .populate("dormId").populate("current_resident_id");
    } catch (error) {
      throw new Error(`Failed to set move-out date: ${error.message}`);
    }
  }

  static async moveStudentOut(roomId, userId) {
    try {
      const room = await Room.findById(roomId);
      if (!room) throw new Error("Room not found");
      if (room.status !== "Occupied") throw new Error(`Room is not occupied (status: ${room.status})`);
      if (room.current_resident_id.toString() !== userId) throw new Error("User is not the current resident");
      return await Room.findByIdAndUpdate(
        roomId,
        { status: "Available", current_resident_id: null, expected_move_in_date: null, expected_available_date: null },
        { new: true }
      ).populate("dormId").populate("current_resident_id");
    } catch (error) {
      throw new Error(`Failed to move student out: ${error.message}`);
    }
  }

  static async deleteRoom(roomId) {
    try {
      const deletedRoom = await Room.findByIdAndDelete(roomId);
      if (!deletedRoom) throw new Error("Room not found");
      return deletedRoom;
    } catch (error) {
      throw new Error(`Failed to delete room: ${error.message}`);
    }
  }

  static async getDormRoomStatistics(dormId) {
    try {
      const rooms = await Room.find({ dormId });
      return {
        total_rooms: rooms.length,
        available: rooms.filter((r) => r.status === "Available").length,
        reserved: rooms.filter((r) => r.status === "Reserved").length,
        occupied: rooms.filter((r) => r.status === "Occupied").length,
        maintenance: rooms.filter((r) => r.status === "Maintenance").length,
        by_type: {
          single: rooms.filter((r) => r.room_type === "Single").length,
          double: rooms.filter((r) => r.room_type === "Double").length,
          triple: rooms.filter((r) => r.room_type === "Triple").length,
        },
        average_price: rooms.length > 0 ? rooms.reduce((sum, r) => sum + r.price_per_month, 0) / rooms.length : 0,
      };
    } catch (error) {
      throw new Error(`Failed to get room statistics: ${error.message}`);
    }
  }

  static async getRoomsByFloor(dormId) {
    try {
      const rooms = await Room.find({ dormId }).populate("current_resident_id", "id name email").sort({ floor: 1, room_number: 1 });
      const byFloor = {};
      rooms.forEach((room) => {
        if (!byFloor[room.floor]) byFloor[room.floor] = [];
        byFloor[room.floor].push(room);
      });
      return byFloor;
    } catch (error) {
      throw new Error(`Failed to get rooms by floor: ${error.message}`);
    }
  }

  static async getUpcomingAvailableRooms(days = 30) {
    try {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);
      const rooms = await Room.find({
        $or: [
          { status: "Available" },
          { status: { $in: ["Occupied", "Reserved"] }, expected_available_date: { $lte: futureDate, $gte: new Date() } },
        ],
      }).populate("dormId", "id name location").populate("current_resident_id", "id name").sort({ expected_available_date: 1 });
      return rooms;
    } catch (error) {
      throw new Error(`Failed to get upcoming available rooms: ${error.message}`);
    }
  }
}
