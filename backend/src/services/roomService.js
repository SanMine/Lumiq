import { Room } from '../models/Room.js';
import { User } from '../models/User.js';
import { Dorm } from '../models/Dorm.js';
import { Op } from 'sequelize';

export class RoomService {
  
  // Get all rooms with optional filtering
  static async getAllRooms(filters = {}) {
    try {
      const where = {};
      
      // Filter by dorm
      if (filters.dormId) {
        where.dormId = filters.dormId;
      }
      
      // Filter by status
      if (filters.status) {
        where.status = filters.status;
      }
      
      // Filter by room type
      if (filters.room_type) {
        where.room_type = filters.room_type;
      }
      
      // Filter by price range
      if (filters.minPrice || filters.maxPrice) {
        where.price_per_month = {};
        if (filters.minPrice) where.price_per_month[Op.gte] = filters.minPrice;
        if (filters.maxPrice) where.price_per_month[Op.lte] = filters.maxPrice;
      }
      
      // Filter by availability (show only available or coming available soon)
      if (filters.showAvailableOnly) {
        where[Op.or] = [
          { status: 'Available' },
          { 
            status: ['Occupied', 'Reserved'],
            expected_available_date: { [Op.lte]: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } // Next 30 days
          }
        ];
      }

      const rooms = await Room.findAll({
        where,
        include: [
          {
            model: Dorm,
            attributes: ['id', 'name', 'location']
          },
          {
            model: User,
            as: 'CurrentResident',
            attributes: ['id', 'name', 'email'],
            required: false // LEFT JOIN - room might not have current resident
          }
        ],
        order: [['dormId', 'ASC'], ['floor', 'ASC'], ['room_number', 'ASC']]
      });

      return rooms;
    } catch (error) {
      throw new Error(`Failed to get rooms: ${error.message}`);
    }
  }

  // Get single room by ID with full details
  static async getRoomById(roomId) {
    try {
      const room = await Room.findByPk(roomId, {
        include: [
          {
            model: Dorm,
            attributes: ['id', 'name', 'location', 'facilities']
          },
          {
            model: User,
            as: 'CurrentResident',
            attributes: ['id', 'name', 'email'],
            required: false
          }
        ]
      });

      if (!room) {
        throw new Error('Room not found');
      }

      return room;
    } catch (error) {
      throw new Error(`Failed to get room: ${error.message}`);
    }
  }

  // Check room availability with detailed information
  static async checkRoomAvailability(roomId) {
    try {
      const room = await this.getRoomById(roomId);
      
      const availability = {
        roomId: room.id,
        room_number: room.room_number,
        status: room.status,
        isAvailable: room.status === 'Available',
        currentResident: room.current_resident_name,
        expectedMoveInDate: room.expected_move_in_date,
        expectedAvailableDate: room.expected_available_date,
        message: this.getAvailabilityMessage(room)
      };

      return availability;
    } catch (error) {
      throw new Error(`Failed to check availability: ${error.message}`);
    }
  }

  // Get availability message for students
  static getAvailabilityMessage(room) {
    switch (room.status) {
      case 'Available':
        return 'This room is available now! You can book it immediately.';
      
      case 'Occupied':
        if (room.expected_available_date) {
          const days = Math.ceil((room.expected_available_date - new Date()) / (1000 * 60 * 60 * 24));
          return `Currently occupied by ${room.current_resident_name}. Expected to be available on ${room.expected_available_date.toLocaleDateString()} (in ${days} days).`;
        }
        return `Currently occupied by ${room.current_resident_name}. No expected move-out date set.`;
      
      case 'Reserved':
        if (room.expected_move_in_date) {
          const days = Math.ceil((room.expected_move_in_date - new Date()) / (1000 * 60 * 60 * 24));
          return `Reserved until ${room.expected_move_in_date.toLocaleDateString()} (${days} days). Will be available after that.`;
        }
        return 'This room is currently reserved.';
      
      case 'Maintenance':
        return 'This room is under maintenance. Please check back later.';
      
      default:
        return 'Status unknown. Please contact support.';
    }
  }

  // Reserve a room for a student
  static async reserveRoom(roomId, userId, moveInDate) {
    try {
      const room = await this.getRoomById(roomId);
      
      if (room.status !== 'Available') {
        throw new Error(`Room is not available. Current status: ${room.status}`);
      }

      const updatedRoom = await room.update({
        status: 'Reserved',
        current_resident_id: userId,
        expected_move_in_date: new Date(moveInDate)
      });

      return {
        success: true,
        message: `Room ${room.room_number} successfully reserved!`,
        room: updatedRoom,
        moveInDate: moveInDate
      };
    } catch (error) {
      throw new Error(`Failed to reserve room: ${error.message}`);
    }
  }

  // Move student into room (change from Reserved to Occupied)
  static async moveStudentIn(roomId, userId) {
    try {
      const room = await this.getRoomById(roomId);
      
      if (room.status !== 'Reserved' || room.current_resident_id !== userId) {
        throw new Error('Room is not reserved for this student');
      }

      const updatedRoom = await room.update({
        status: 'Occupied',
        expected_move_in_date: null, // Clear since they've moved in
        expected_available_date: null // Will be set when they plan to move out
      });

      return {
        success: true,
        message: `Welcome to room ${room.room_number}! Move-in completed.`,
        room: updatedRoom
      };
    } catch (error) {
      throw new Error(`Failed to move student in: ${error.message}`);
    }
  }

  // Set expected move-out date
  static async setMoveOutDate(roomId, userId, moveOutDate) {
    try {
      const room = await this.getRoomById(roomId);
      
      if (room.status !== 'Occupied' || room.current_resident_id !== userId) {
        throw new Error('Only current resident can set move-out date');
      }

      const updatedRoom = await room.update({
        expected_available_date: new Date(moveOutDate)
      });

      return {
        success: true,
        message: `Move-out date set for ${moveOutDate}. Other students can now see when this room will be available.`,
        room: updatedRoom
      };
    } catch (error) {
      throw new Error(`Failed to set move-out date: ${error.message}`);
    }
  }

  // Move student out (make room available)
  static async moveStudentOut(roomId, userId) {
    try {
      const room = await this.getRoomById(roomId);
      
      if (room.status !== 'Occupied' || room.current_resident_id !== userId) {
        throw new Error('Only current resident can move out');
      }

      const updatedRoom = await room.update({
        status: 'Available',
        current_resident_id: null,
        expected_available_date: null,
        expected_move_in_date: null
      });

      return {
        success: true,
        message: `Successfully moved out of room ${room.room_number}. Room is now available for new bookings.`,
        room: updatedRoom
      };
    } catch (error) {
      throw new Error(`Failed to move student out: ${error.message}`);
    }
  }

  // Get rooms that will be available soon (for planning)
  static async getUpcomingAvailableRooms(days = 30) {
    try {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);

      const rooms = await Room.findAll({
        where: {
          status: ['Occupied', 'Reserved'],
          expected_available_date: {
            [Op.between]: [new Date(), futureDate]
          }
        },
        include: [
          {
            model: Dorm,
            attributes: ['id', 'name', 'location']
          },
          {
            model: User,
            as: 'CurrentResident',
            attributes: ['name'],
            required: false
          }
        ],
        order: [['expected_available_date', 'ASC']]
      });

      return rooms.map(room => ({
        ...room.toJSON(),
        daysUntilAvailable: Math.ceil((room.expected_available_date - new Date()) / (1000 * 60 * 60 * 24)),
        availabilityMessage: this.getAvailabilityMessage(room)
      }));
    } catch (error) {
      throw new Error(`Failed to get upcoming available rooms: ${error.message}`);
    }
  }

  // Get room statistics for dashboard
  static async getRoomStatistics(dormId = null) {
    try {
      const where = dormId ? { dormId } : {};
      
      const stats = await Room.findAll({
        where,
        attributes: [
          'status',
          [Room.sequelize.fn('COUNT', '*'), 'count']
        ],
        group: ['status']
      });

      const total = await Room.count({ where });
      
      const result = {
        total,
        available: 0,
        occupied: 0,
        reserved: 0,
        maintenance: 0
      };

      stats.forEach(stat => {
        result[stat.status.toLowerCase()] = parseInt(stat.get('count'));
      });

      result.occupancyRate = total > 0 ? Math.round(((result.occupied + result.reserved) / total) * 100) : 0;

      return result;
    } catch (error) {
      throw new Error(`Failed to get room statistics: ${error.message}`);
    }
  }

  // Create new room
  static async createRoom(dormId, roomData) {
    try {
      const newRoom = await Room.create({
        dormId,
        ...roomData
      });

      return await this.getRoomById(newRoom.id);
    } catch (error) {
      throw new Error(`Failed to create room: ${error.message}`);
    }
  }

  // Update room
  static async updateRoom(roomId, updateData) {
    try {
      const room = await Room.findByPk(roomId);
      if (!room) {
        throw new Error('Room not found');
      }

      await room.update(updateData);
      return await this.getRoomById(roomId);
    } catch (error) {
      throw new Error(`Failed to update room: ${error.message}`);
    }
  }

  // Delete room
  static async deleteRoom(roomId) {
    try {
      const room = await Room.findByPk(roomId);
      if (!room) {
        throw new Error('Room not found');
      }

      await room.destroy();
      return { success: true, message: 'Room deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete room: ${error.message}`);
    }
  }

  // Get rooms by dorm
  static async getRoomsByDorm(dormId) {
    try {
      return await this.getAllRooms({ dormId });
    } catch (error) {
      throw new Error(`Failed to get rooms by dorm: ${error.message}`);
    }
  }

  // Update room availability
  static async updateRoomAvailability(roomId, available) {
    try {
      const room = await Room.findByPk(roomId);
      if (!room) {
        throw new Error('Room not found');
      }

      const status = available ? 'Available' : 'Maintenance';
      await room.update({ status });
      
      return await this.getRoomById(roomId);
    } catch (error) {
      throw new Error(`Failed to update room availability: ${error.message}`);
    }
  }

  // Get dorm room statistics
  static async getDormRoomStatistics(dormId) {
    try {
      return await this.getRoomStatistics(dormId);
    } catch (error) {
      throw new Error(`Failed to get dorm room statistics: ${error.message}`);
    }
  }

  // Get rooms by floor
  static async getRoomsByFloor(dormId) {
    try {
      const rooms = await this.getAllRooms({ dormId });
      
      const roomsByFloor = {};
      rooms.forEach(room => {
        const floor = room.floor;
        if (!roomsByFloor[floor]) {
          roomsByFloor[floor] = [];
        }
        roomsByFloor[floor].push(room);
      });

      return roomsByFloor;
    } catch (error) {
      throw new Error(`Failed to get rooms by floor: ${error.message}`);
    }
  }
}
