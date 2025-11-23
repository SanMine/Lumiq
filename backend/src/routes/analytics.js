import { Router } from "express";
import { AnalyticsService } from "../services/analyticsService.js";
import { requireAuth, requireDormAdmin } from "../middlewares/auth.js";

export const analytics = Router();

// Get complete overview data (all KPIs and charts)
analytics.get("/overview", requireAuth, requireDormAdmin, async (req, res, next) => {
    try {
        const data = await AnalyticsService.getOverview(req.user.id);
        res.json(data);
    } catch (error) {
        next(error);
    }
});

// Get revenue trend
analytics.get("/revenue-trend", requireAuth, requireDormAdmin, async (req, res, next) => {
    try {
        const months = parseInt(req.query.months) || 12;
        const data = await AnalyticsService.getRevenueTrend(req.user.id, months);
        res.json(data);
    } catch (error) {
        next(error);
    }
});

// Get yearly booking trend
analytics.get("/booking-trend", requireAuth, requireDormAdmin, async (req, res, next) => {
    try {
        const data = await AnalyticsService.getYearlyBookingTrend(req.user.id);
        res.json(data);
    } catch (error) {
        next(error);
    }
});

// Get room occupancy statistics
analytics.get("/room-occupancy", requireAuth, requireDormAdmin, async (req, res, next) => {
    try {
        const data = await AnalyticsService.getRoomOccupancyStats(req.user.id);
        res.json(data);
    } catch (error) {
        next(error);
    }
});

// Get recent bookings
analytics.get("/recent-bookings", requireAuth, requireDormAdmin, async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const data = await AnalyticsService.getRecentBookings(req.user.id, limit);
        res.json(data);
    } catch (error) {
        next(error);
    }
});

// Get detailed analytics data
analytics.get("/detailed", requireAuth, requireDormAdmin, async (req, res, next) => {
    try {
        const data = await AnalyticsService.getAnalyticsData(req.user.id);
        res.json(data);
    } catch (error) {
        next(error);
    }
});
