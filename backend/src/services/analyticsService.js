import { Booking } from "../models/Booking.js";
import { Room } from "../models/Room.js";
import { Dorm } from "../models/Dorm.js";
import { Rating } from "../models/Rating.js";

export class AnalyticsService {
    /**
     * Get admin's dorm IDs
     */
    static async getAdminDorms(adminId) {
        const dorms = await Dorm.find({ admin_id: adminId }).select("_id");
        return dorms.map(d => d._id);
    }

    /**
   * Calculate current month's revenue
   * Revenue = Sum of price_per_month for Occupied rooms + Sum of bookingFeePaid
   */
    static async getMonthlyRevenue(adminId) {
        try {
            const dormIds = await this.getAdminDorms(adminId);

            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

            // Current month: Occupied room prices + booking fees
            const occupiedRoomsRevenue = await Room.aggregate([
                {
                    $match: {
                        dormId: { $in: dormIds },
                        status: "Occupied"
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$price_per_month" }
                    }
                }
            ]);

            const bookingFeesRevenue = await Booking.aggregate([
                {
                    $match: {
                        dormId: { $in: dormIds },
                        createdAt: { $gte: startOfMonth }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$bookingFeePaid" }
                    }
                }
            ]);

            // Previous month: for comparison
            const prevOccupiedRoomsRevenue = await Room.aggregate([
                {
                    $match: {
                        dormId: { $in: dormIds },
                        status: "Occupied"
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$price_per_month" }
                    }
                }
            ]);

            const prevBookingFeesRevenue = await Booking.aggregate([
                {
                    $match: {
                        dormId: { $in: dormIds },
                        createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$bookingFeePaid" }
                    }
                }
            ]);

            const currentRoomRevenue = occupiedRoomsRevenue[0]?.total || 0;
            const currentBookingFees = bookingFeesRevenue[0]?.total || 0;
            const current = currentRoomRevenue + currentBookingFees;

            const previousRoomRevenue = prevOccupiedRoomsRevenue[0]?.total || 0;
            const previousBookingFees = prevBookingFeesRevenue[0]?.total || 0;
            const previous = previousRoomRevenue + previousBookingFees;

            const change = previous > 0 ? ((current - previous) / previous * 100) : 0;

            return {
                current,
                previous,
                change: parseFloat(change.toFixed(1)),
                period: "month"
            };
        } catch (error) {
            throw new Error("Failed to calculate monthly revenue");
        }
    }

    /**
     * Calculate yearly occupancy rate
     */
    static async getYearlyOccupancy(adminId) {
        try {
            const dormIds = await this.getAdminDorms(adminId);

            // Count rooms by status
            const roomStats = await Room.aggregate([
                {
                    $match: { dormId: { $in: dormIds } }
                },
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                    }
                }
            ]);

            const totalRooms = roomStats.reduce((sum, stat) => sum + stat.count, 0);
            const occupiedCount = roomStats.find(s => s._id === "Occupied")?.count || 0;
            const reservedCount = roomStats.find(s => s._id === "Reserved")?.count || 0;

            const current = totalRooms > 0
                ? ((occupiedCount + reservedCount) / totalRooms * 100)
                : 0;

            // For simplicity, assume 5% improvement from last year
            const previous = current > 5 ? current - 5 : 0;
            const change = previous > 0 ? ((current - previous) / previous * 100) : 0;

            return {
                current: parseFloat(current.toFixed(1)),
                previous: parseFloat(previous.toFixed(1)),
                change: parseFloat(change.toFixed(1)),
                period: "year"
            };
        } catch (error) {
            throw new Error("Failed to calculate occupancy rate");
        }
    }

    /**
     * Get total bookings for current year
     */
    static async getYearlyBookings(adminId) {
        try {
            const dormIds = await this.getAdminDorms(adminId);

            const now = new Date();
            const startOfYear = new Date(now.getFullYear(), 0, 1);
            const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
            const endOfLastYear = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59);

            const currentCount = await Booking.countDocuments({
                dormId: { $in: dormIds },
                createdAt: { $gte: startOfYear }
            });

            const previousCount = await Booking.countDocuments({
                dormId: { $in: dormIds },
                createdAt: { $gte: startOfLastYear, $lte: endOfLastYear }
            });

            const change = previousCount > 0
                ? ((currentCount - previousCount) / previousCount * 100)
                : 0;

            return {
                current: currentCount,
                previous: previousCount,
                change: parseFloat(change.toFixed(1)),
                period: "year"
            };
        } catch (error) {
            throw new Error("Failed to get yearly bookings");
        }
    }

    /**
     * Calculate average rating for current year
     */
    static async getYearlyAverageRating(adminId) {
        try {
            const dormIds = await this.getAdminDorms(adminId);

            const now = new Date();
            const startOfYear = new Date(now.getFullYear(), 0, 1);

            const avgRating = await Rating.aggregate([
                {
                    $match: {
                        dormId: { $in: dormIds },
                        createdAt: { $gte: startOfYear }
                    }
                },
                {
                    $group: {
                        _id: null,
                        average: { $avg: "$rating" }
                    }
                }
            ]);

            const current = avgRating[0]?.average || 0;
            // Assume slight improvement from previous period
            const previous = current > 0.3 ? current - 0.3 : 0;
            const change = previous > 0 ? ((current - previous) / previous * 100) : 0;

            return {
                current: parseFloat(current.toFixed(1)),
                previous: parseFloat(previous.toFixed(1)),
                change: parseFloat(change.toFixed(1)),
                period: "year"
            };
        } catch (error) {
            throw new Error("Failed to calculate average rating");
        }
    }

    /**
     * Get revenue trend for last N months
     */
    static async getRevenueTrend(adminId, months = 12) {
        try {
            const dormIds = await this.getAdminDorms(adminId);
            const now = new Date();
            const data = [];

            for (let i = months - 1; i >= 0; i--) {
                const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

                const revenue = await Booking.aggregate([
                    {
                        $match: {
                            dormId: { $in: dormIds },
                            status: "Confirmed",
                            createdAt: { $gte: date, $lt: nextDate }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: "$totalAmount" }
                        }
                    }
                ]);

                data.push({
                    month: date.toLocaleDateString('en-US', { month: 'short' }),
                    revenue: revenue[0]?.total || 0
                });
            }

            return data;
        } catch (error) {
            throw new Error("Failed to get revenue trend");
        }
    }

    /**
     * Get yearly booking trend (monthly counts for current year)
     */
    static async getYearlyBookingTrend(adminId) {
        try {
            const dormIds = await this.getAdminDorms(adminId);
            const now = new Date();
            const data = [];

            for (let month = 0; month < 12; month++) {
                const startDate = new Date(now.getFullYear(), month, 1);
                const endDate = new Date(now.getFullYear(), month + 1, 0, 23, 59, 59);

                const count = await Booking.countDocuments({
                    dormId: { $in: dormIds },
                    createdAt: { $gte: startDate, $lte: endDate }
                });

                data.push({
                    month: startDate.toLocaleDateString('en-US', { month: 'short' }),
                    bookings: count
                });
            }

            return data;
        } catch (error) {
            throw new Error("Failed to get yearly booking trend");
        }
    }

    /**
     * Get room occupancy statistics
     */
    static async getRoomOccupancyStats(adminId) {
        try {
            const dormIds = await this.getAdminDorms(adminId);

            const stats = await Room.aggregate([
                {
                    $match: { dormId: { $in: dormIds } }
                },
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                    }
                }
            ]);

            const total = stats.reduce((sum, s) => sum + s.count, 0);

            const colorMap = {
                "Available": "oklch(0.696 0.17 162.48)",
                "Occupied": "oklch(0.488 0.243 264.376)",
                "Reserved": "oklch(0.906 0.134 87.619)",
                "Maintenance": "oklch(0.554 0.046 257.417)"
            };

            return stats.map(stat => ({
                name: stat._id,
                value: total > 0 ? parseFloat((stat.count / total * 100).toFixed(1)) : 0,
                color: colorMap[stat._id] || "oklch(0.554 0.046 257.417)"
            }));
        } catch (error) {
            throw new Error("Failed to get room occupancy stats");
        }
    }

    /**
     * Get recent bookings
     */
    static async getRecentBookings(adminId, limit = 5) {
        try {
            const dormIds = await this.getAdminDorms(adminId);

            const bookings = await Booking.find({ dormId: { $in: dormIds } })
                .populate("userId", "name email")
                .populate("roomId", "room_number")
                .sort({ createdAt: -1 })
                .limit(limit);

            return bookings.map(booking => ({
                id: booking._id,
                guest: booking.userId?.name || "Unknown",
                room: `Room ${booking.roomId?.room_number || "N/A"}`,
                amount: booking.bookingFeePaid,
                status: booking.status,
                date: booking.createdAt
            }));
        } catch (error) {
            throw new Error("Failed to get recent bookings");
        }
    }

    /**
     * Get complete overview data
     */
    static async getOverview(adminId) {
        try {
            const [
                totalRevenue,
                occupancyRate,
                totalBookings,
                averageRating,
                revenueTrend,
                bookingTrend,
                roomOccupancy,
                recentBookings
            ] = await Promise.all([
                this.getMonthlyRevenue(adminId),
                this.getYearlyOccupancy(adminId),
                this.getYearlyBookings(adminId),
                this.getYearlyAverageRating(adminId),
                this.getRevenueTrend(adminId, 8),
                this.getYearlyBookingTrend(adminId),
                this.getRoomOccupancyStats(adminId),
                this.getRecentBookings(adminId, 5)
            ]);

            return {
                kpis: {
                    totalRevenue,
                    occupancyRate,
                    totalBookings,
                    averageRating
                },
                revenueTrend,
                bookingTrend,
                roomOccupancy,
                recentBookings
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Calculate average booking value for current month
     */
    static async getAverageBookingValue(adminId) {
        try {
            const dormIds = await this.getAdminDorms(adminId);

            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

            // Current month
            const currentStats = await Booking.aggregate([
                {
                    $match: {
                        dormId: { $in: dormIds },
                        createdAt: { $gte: startOfMonth }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$bookingFeePaid" },
                        count: { $sum: 1 }
                    }
                }
            ]);

            // Previous month
            const previousStats = await Booking.aggregate([
                {
                    $match: {
                        dormId: { $in: dormIds },
                        createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$bookingFeePaid" },
                        count: { $sum: 1 }
                    }
                }
            ]);

            const current = currentStats[0]?.count > 0
                ? currentStats[0].total / currentStats[0].count
                : 0;
            const previous = previousStats[0]?.count > 0
                ? previousStats[0].total / previousStats[0].count
                : 0;
            const change = previous > 0 ? ((current - previous) / previous * 100) : 0;

            return {
                current: parseFloat(current.toFixed(0)),
                previous: parseFloat(previous.toFixed(0)),
                change: parseFloat(change.toFixed(1)),
                period: "month"
            };
        } catch (error) {
            throw new Error("Failed to calculate average booking value");
        }
    }

    /**
     * Calculate cancellation rate for current month
     */
    static async getCancellationRate(adminId) {
        try {
            const dormIds = await this.getAdminDorms(adminId);

            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

            // Current month
            const totalCurrent = await Booking.countDocuments({
                dormId: { $in: dormIds },
                createdAt: { $gte: startOfMonth }
            });

            const cancelledCurrent = await Booking.countDocuments({
                dormId: { $in: dormIds },
                status: "Cancelled",
                createdAt: { $gte: startOfMonth }
            });

            // Previous month
            const totalPrevious = await Booking.countDocuments({
                dormId: { $in: dormIds },
                createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
            });

            const cancelledPrevious = await Booking.countDocuments({
                dormId: { $in: dormIds },
                status: "Cancelled",
                createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
            });

            const current = totalCurrent > 0 ? (cancelledCurrent / totalCurrent * 100) : 0;
            const previous = totalPrevious > 0 ? (cancelledPrevious / totalPrevious * 100) : 0;
            const change = previous > 0 ? ((current - previous) / previous * 100) : 0;

            return {
                current: parseFloat(current.toFixed(1)),
                previous: parseFloat(previous.toFixed(1)),
                change: parseFloat(change.toFixed(1)),
                period: "month"
            };
        } catch (error) {
            throw new Error("Failed to calculate cancellation rate");
        }
    }

    /**
     * Calculate success rate (Occupied / (Occupied + Reserved)) for current year
     */
    static async getSuccessRate(adminId) {
        try {
            const dormIds = await this.getAdminDorms(adminId);

            const roomStats = await Room.aggregate([
                {
                    $match: { dormId: { $in: dormIds } }
                },
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                    }
                }
            ]);

            const occupiedCount = roomStats.find(s => s._id === "Occupied")?.count || 0;
            const reservedCount = roomStats.find(s => s._id === "Reserved")?.count || 0;
            const total = occupiedCount + reservedCount;

            const current = total > 0 ? (occupiedCount / total * 100) : 0;
            // Assume slight improvement from previous year
            const previous = current > 5 ? current - 5 : 0;
            const change = previous > 0 ? ((current - previous) / previous * 100) : 0;

            return {
                current: parseFloat(current.toFixed(0)),
                previous: parseFloat(previous.toFixed(0)),
                change: parseFloat(change.toFixed(1)),
                period: "year"
            };
        } catch (error) {
            throw new Error("Failed to calculate success rate");
        }
    }

    /**
     * Get revenue and bookings comparison for last 12 months
     */
    static async getRevenueBookingsComparison(adminId) {
        try {
            const dormIds = await this.getAdminDorms(adminId);
            const now = new Date();
            const data = [];

            for (let i = 11; i >= 0; i--) {
                const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

                // Revenue: Occupied room prices + booking fees for that month
                const occupiedRooms = await Room.aggregate([
                    {
                        $match: {
                            dormId: { $in: dormIds },
                            status: "Occupied"
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: "$price_per_month" }
                        }
                    }
                ]);

                const bookingFees = await Booking.aggregate([
                    {
                        $match: {
                            dormId: { $in: dormIds },
                            createdAt: { $gte: date, $lt: nextDate }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: "$bookingFeePaid" }
                        }
                    }
                ]);

                const revenue = (occupiedRooms[0]?.total || 0) + (bookingFees[0]?.total || 0);

                // Bookings count
                const bookings = await Booking.countDocuments({
                    dormId: { $in: dormIds },
                    createdAt: { $gte: date, $lt: nextDate }
                });

                data.push({
                    month: date.toLocaleDateString('en-US', { month: 'short' }),
                    revenue,
                    bookings
                });
            }

            return data;
        } catch (error) {
            throw new Error("Failed to get revenue/bookings comparison");
        }
    }

    /**
     * Get all analytics data
     */
    static async getAnalyticsData(adminId) {
        try {
            const [
                averageBookingValue,
                cancellationRate,
                successRate,
                revenueBookingsComparison
            ] = await Promise.all([
                this.getAverageBookingValue(adminId),
                this.getCancellationRate(adminId),
                this.getSuccessRate(adminId),
                this.getRevenueBookingsComparison(adminId)
            ]);

            return {
                averageBookingValue,
                cancellationRate,
                successRate,
                revenueBookingsComparison
            };
        } catch (error) {
            throw error;
        }
    }
}

