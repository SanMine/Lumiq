import { Router } from "express";
import { Dorm } from "../models/Dorm.js";
import { Rating } from "../models/Rating.js";
import { User } from "../models/User.js";
import { RatingService } from "../services/ratingService.js";
import { requireAuth, requireDormAdmin } from "../middlewares/auth.js";
import { getNextId } from "../db/counter.js";

export const dorms = Router();

// Get dorms for authenticated admin (only their own dorms)
dorms.get("/my", requireAuth, requireDormAdmin, async (req, res, next) => {
  try {
    const adminDorms = await Dorm.find({ admin_id: req.user.id }).sort({ _id: 1 });
    const dormsWithRatings =
      await RatingService.calculateMultipleDormRatings(adminDorms);
    res.json(dormsWithRatings);
  } catch (error) {
    next(error);
  }
});

// Public: get all dorms with ratings
dorms.get("/", async (req, res, next) => {
  try {
    const allDorms = await Dorm.find().sort({ _id: 1 });
    const dormsWithRatings =
      await RatingService.calculateMultipleDormRatings(allDorms);
    res.json(dormsWithRatings);
  } catch (error) {
    next(error);
  }
});

// NEW: Find nearby dorms
dorms.get("/nearby", async (req, res, next) => {
  try {
    const { latitude, longitude, radius = 5 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ 
        error: "Latitude and longitude are required" 
      });
    }

    const nearbyDorms = await Dorm.findNearby(
      parseFloat(latitude),
      parseFloat(longitude),
      parseFloat(radius)
    );

    res.json(nearbyDorms);
  } catch (error) {
    next(error);
  }
});

// Get specific dorm with ratings
dorms.get("/:id", async (req, res, next) => {
  try {
    const dorm = await Dorm.findById(req.params.id);

    if (!dorm) {
      return res.status(404).json({ error: "Dorm not found" });
    }

    const ratingStats = await RatingService.getDormRatingStatistics(
      req.params.id
    );

    const result = {
      ...dorm.toJSON(),
      average_rating: ratingStats.average_rating,
      total_ratings: ratingStats.total_ratings,
      min_rating: ratingStats.min_rating,
      max_rating: ratingStats.max_rating,
    };

    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Create new dorm
dorms.post("/", requireAuth, requireDormAdmin, async (req, res, next) => {
  try {
    // Check if admin already has a dorm
    const existingDorm = await Dorm.findOne({ admin_id: req.user.id });
    if (existingDorm) {
      return res.status(400).json({ 
        error: "You can only create one dorm. Please update your existing dorm or delete it first." 
      });
    }

    // Generate next ID
    const dormId = await getNextId('dorms');
    
    // Create dorm with admin_id and generated _id
    const dorm = await Dorm.create({
      ...req.body,
      _id: dormId,
      admin_id: req.user.id,
    });
    
    res.status(201).json(dorm);
  } catch (error) {
    next(error);
  }
});

// NEW: Update ONLY address (without requiring location coordinates)
dorms.put("/:id/address", requireAuth, requireDormAdmin, async (req, res, next) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ 
        error: "Address data is required" 
      });
    }

    // Verify dorm belongs to this admin
    const dorm = await Dorm.findById(req.params.id);
    if (!dorm) {
      return res.status(404).json({ error: "Dorm not found" });
    }

    if (dorm.admin_id !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized to update this dorm" });
    }

    // Update only address fields
    const updatedDorm = await Dorm.findByIdAndUpdate(
      req.params.id,
      { 
        address: {
          addressLine1: address.addressLine1 || dorm.address?.addressLine1,
          subDistrict: address.subDistrict || dorm.address?.subDistrict,
          district: address.district || dorm.address?.district,
          province: address.province || dorm.address?.province,
          zipCode: address.zipCode || dorm.address?.zipCode,
          country: address.country || dorm.address?.country || "Thailand",
        }
      },
      { new: true, runValidators: true }
    );

    res.json({
      message: "Address updated successfully",
      dorm: updatedDorm
    });
  } catch (error) {
    console.error("Error updating address:", error);
    next(error);
  }
});

// NEW: Update ONLY location coordinates (without requiring address)
dorms.put("/:id/location", requireAuth, requireDormAdmin, async (req, res, next) => {
  try {
    const { latitude, longitude } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ 
        error: "Latitude and longitude are required" 
      });
    }

    // Validate coordinate ranges
    if (latitude < -90 || latitude > 90) {
      return res.status(400).json({ 
        error: "Latitude must be between -90 and 90" 
      });
    }

    if (longitude < -180 || longitude > 180) {
      return res.status(400).json({ 
        error: "Longitude must be between -180 and 180" 
      });
    }

    // Verify dorm belongs to this admin
    const dorm = await Dorm.findById(req.params.id);
    if (!dorm) {
      return res.status(404).json({ error: "Dorm not found" });
    }

    if (dorm.admin_id !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized to update this dorm" });
    }

    // Update only coordinates
    const updatedDorm = await Dorm.findByIdAndUpdate(
      req.params.id,
      { 
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      },
      { new: true, runValidators: true }
    );

    res.json({
      message: "Location coordinates updated successfully",
      dorm: updatedDorm
    });
  } catch (error) {
    console.error("Error updating location:", error);
    next(error);
  }
});

// Rate a dorm
dorms.post("/:id/rate", async (req, res, next) => {
  try {
    const { rating, userId } = req.body;
    const dormId = req.params.id;

    const dorm = await Dorm.findById(dormId);
    if (!dorm) {
      return res.status(404).json({ error: "Dorm not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const result = await RatingService.addOrUpdateRating(
      dormId,
      userId,
      rating
    );

    res.json({
      message: result.message,
      rating: result.rating,
      average_rating: result.statistics.average_rating,
      total_ratings: result.statistics.total_ratings,
    });
  } catch (error) {
    next(error);
  }
});

// Get ratings for a specific dorm
dorms.get("/:id/ratings", async (req, res, next) => {
  try {
    const ratings = await RatingService.getDormRatings(req.params.id);
    res.json(ratings);
  } catch (error) {
    next(error);
  }
});

// Get rating distribution for a specific dorm
dorms.get("/:id/rating-distribution", async (req, res, next) => {
  try {
    const distribution = await RatingService.getRatingDistribution(
      req.params.id
    );
    res.json(distribution);
  } catch (error) {
    next(error);
  }
});

// Update dorm (general update - keeps all existing functionality)
dorms.put("/:id", requireAuth, requireDormAdmin, async (req, res, next) => {
  try {
    // Verify dorm belongs to this admin
    const dorm = await Dorm.findById(req.params.id);
    if (!dorm) {
      return res.status(404).json({ error: "Dorm not found" });
    }

    if (dorm.admin_id !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized to update this dorm" });
    }

    const updatedDorm = await Dorm.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedDorm);
  } catch (error) {
    next(error);
  }
});

// Delete dorm
dorms.delete("/:id", requireAuth, requireDormAdmin, async (req, res, next) => {
  try {
    // Verify dorm belongs to this admin
    const dorm = await Dorm.findById(req.params.id);
    if (!dorm) {
      return res.status(404).json({ error: "Dorm not found" });
    }

    if (dorm.admin_id !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized to delete this dorm" });
    }

    const deletedDorm = await Dorm.findByIdAndDelete(req.params.id);

    res.json({ message: "Dorm deleted successfully" });
  } catch (error) {
    next(error);
  }
});