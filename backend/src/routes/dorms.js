import { Router } from "express";
import { Dorm } from "../models/Dorm.js";
import { Room } from "../models/Room.js";
import { Rating } from "../models/Rating.js";
import { User } from "../models/User.js";
import { RatingService } from "../services/ratingService.js";
import { Preferred_roommate } from "../models/Preferred_roommate.js";
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

// NEW: Get shared dorm suggestions based on price preference
dorms.get("/shared-suggestions", requireAuth, async (req, res, next) => {
  try {
    const { userId } = req.query;
    const currentUserId = req.user.id;

    if (!userId) {
      return res.status(400).json({ error: "Target userId is required" });
    }

    // Fetch preferences for both users
    const [currentUserPref, targetUserPref] = await Promise.all([
      Preferred_roommate.findOne({ userId: currentUserId }),
      Preferred_roommate.findOne({ userId: userId }),
    ]);

    if (!currentUserPref || !targetUserPref) {
      return res.status(404).json({ error: "Preferences not found for one or both users" });
    }

    const user1Range = currentUserPref.preferred_price_range;
    const user2Range = targetUserPref.preferred_price_range;

    // Calculate Intersection
    let minPrice = Math.max(user1Range.min, user2Range.min);
    let maxPrice = Math.min(user1Range.max, user2Range.max);
    let rangeType = "intersection";

    // Check for overlap
    if (minPrice > maxPrice) {
      // No overlap - Calculate Average (Compromise)
      minPrice = (user1Range.min + user2Range.min) / 2;
      maxPrice = (user1Range.max + user2Range.max) / 2;
      rangeType = "average";
    }

    // Query Double Rooms that fit the budget per person
    // User request: "if the rooms price is less than the users prefer price range it;s oaky"
    // So we only enforce the MAXIMUM limit.
    let doubleRooms = await Room.find({
      room_type: "Double",
      status: "Available",
      price_per_month: { $lte: maxPrice * 2 }
    });

    // Fallback: "never show the empty connection page"
    // If no rooms fit the budget, just show the cheapest available double rooms
    if (doubleRooms.length === 0) {
      doubleRooms = await Room.find({
        room_type: "Double",
        status: "Available"
      }).sort({ price_per_month: 1 }).limit(20); // Fetch top 20 cheapest

      rangeType = "fallback (cheapest available)";
    }

    // Group by dormId and find the best deal (lowest price) for each dorm
    const dormDeals = {};
    doubleRooms.forEach(room => {
      if (!dormDeals[room.dormId] || room.price_per_month < dormDeals[room.dormId].price) {
        dormDeals[room.dormId] = {
          price: room.price_per_month,
          pricePerPerson: room.price_per_month / 2
        };
      }
    });

    const dormIds = Object.keys(dormDeals);

    // Fetch Dorm details
    const suggestedDorms = await Dorm.find({
      _id: { $in: dormIds },
      isActive: true
    }).limit(10);

    // Calculate ratings
    const dormsWithRatings = await RatingService.calculateMultipleDormRatings(suggestedDorms);

    // Attach deal info to each dorm
    const resultDorms = dormsWithRatings.map(dorm => ({
      ...dorm,
      minDoublePrice: dormDeals[dorm._id].price,
      pricePerPerson: dormDeals[dorm._id].pricePerPerson
    }));

    res.json({
      dorms: resultDorms,
      range: { min: 0, max: maxPrice, type: rangeType } // Min is effectively 0 now
    });
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

    // Handle legacy location field from frontend
    const dormData = { ...req.body };
    if (dormData.location && !dormData.address) {
      dormData.address = {
        addressLine1: dormData.location,
        subDistrict: "",
        district: "",
        province: "",
        zipCode: "",
        country: "Thailand"
      };
    }

    // Create dorm with admin_id and generated _id
    const dorm = await Dorm.create({
      ...dormData,
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

// Rate a dorm (requires authentication)
dorms.post("/:id/rate", requireAuth, async (req, res, next) => {
  try {
    const { rating, userId, comment } = req.body;
    const dormId = req.params.id;

    const dorm = await Dorm.findById(dormId);
    if (!dorm) {
      return res.status(404).json({ error: "Dorm not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if user is a resident of this dorm
    if (String(user.dormId) !== String(dormId)) {
      return res.status(403).json({ error: "Only residents of this dorm can submit reviews." });
    }

    const result = await RatingService.addOrUpdateRating(
      dormId,
      userId,
      rating,
      comment
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

// Update a rating (only by author)
dorms.put("/:id/ratings/:ratingId", requireAuth, async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const { id: dormId, ratingId } = req.params;

    const existingRating = await Rating.findById(ratingId);
    if (!existingRating) {
      return res.status(404).json({ error: "Rating not found" });
    }

    // Check if user is the author
    if (String(existingRating.userId) !== String(req.user.id)) {
      return res.status(403).json({ error: "You can only update your own ratings" });
    }

    // Verify rating belongs to this dorm
    if (String(existingRating.dormId) !== String(dormId)) {
      return res.status(400).json({ error: "Rating does not belong to this dorm" });
    }

    const result = await RatingService.addOrUpdateRating(
      dormId,
      req.user.id,
      rating,
      comment
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

// Delete a rating (by author or dorm admin)
dorms.delete("/:id/ratings/:ratingId", requireAuth, async (req, res, next) => {
  try {
    const { id: dormId, ratingId } = req.params;

    const result = await RatingService.deleteRating(
      ratingId,
      req.user.id,
      req.user.role,
      dormId
    );

    res.json({
      message: result.message,
      average_rating: result.statistics.average_rating,
      total_ratings: result.statistics.total_ratings,
    });
  } catch (error) {
    if (error.message === "Rating not found") {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === "Unauthorized to delete this rating") {
      return res.status(403).json({ error: error.message });
    }
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