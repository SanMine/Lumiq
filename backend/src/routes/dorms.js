import { Router } from "express";
import { Dorm } from "../models/Dorm.js";
import { Rating } from "../models/Rating.js";
import { User } from "../models/User.js";
import { RatingService } from "../services/ratingService.js";

export const dorms = Router();

// Get all dorms with calculated average ratings
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
dorms.post("/", async (req, res, next) => {
  try {
    const dorm = await Dorm.create(req.body);
    res.status(201).json(dorm);
  } catch (error) {
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

// Update dorm
dorms.put("/:id", async (req, res, next) => {
  try {
    const updatedDorm = await Dorm.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedDorm) {
      return res.status(404).json({ error: "Dorm not found" });
    }

    res.json(updatedDorm);
  } catch (error) {
    next(error);
  }
});

// Delete dorm
dorms.delete("/:id", async (req, res, next) => {
  try {
    const deletedDorm = await Dorm.findByIdAndDelete(req.params.id);

    if (!deletedDorm) {
      return res.status(404).json({ error: "Dorm not found" });
    }

    res.json({ message: "Dorm deleted successfully" });
  } catch (error) {
    next(error);
  }
});