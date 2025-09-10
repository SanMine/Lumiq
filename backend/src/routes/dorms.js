import { Router } from "express";
import { Dorm } from "../models/Dorm.js";
import { Rating } from "../models/Rating.js";
import { User } from "../models/User.js";
import { sequelize } from "../../sequelize.js";
import { RatingService } from "../services/ratingService.js";

export const dorms = Router();

// Get all dorms with calculated average ratings
dorms.get("/", async (req, res) => {
  try {
    // Get all dorms
    const allDorms = await Dorm.findAll({
      order: [["id", "ASC"]]
    });

    // Calculate ratings using the service
    const dormsWithRatings = await RatingService.calculateMultipleDormRatings(allDorms);

    res.json(dormsWithRatings);
  } catch (error) {
    console.error("Error fetching dorms:", error);
    res.status(500).json({ error: "Failed to fetch dorms" });
  }
});

// Get specific dorm with ratings
dorms.get("/:id", async (req, res) => {
  try {
    // Get the dorm
    const dorm = await Dorm.findByPk(req.params.id);
    
    if (!dorm) {
      return res.status(404).json({ error: "Dorm not found" });
    }

    // Calculate detailed rating statistics
    const ratingStats = await RatingService.getDormRatingStatistics(req.params.id);
    
    const result = {
      ...dorm.toJSON(),
      average_rating: ratingStats.average_rating,
      total_ratings: ratingStats.total_ratings,
      min_rating: ratingStats.min_rating,
      max_rating: ratingStats.max_rating
    };

    res.json(result);
  } catch (error) {
    console.error("Error fetching dorm:", error);
    res.status(500).json({ error: "Failed to fetch dorm" });
  }
});

// Create new dorm
dorms.post("/", async (req, res) => {
  try {
    const dorm = await Dorm.create(req.body);
    res.status(201).json(dorm);
  } catch (error) {
    console.error("Error creating dorm:", error);
    res.status(500).json({ error: "Failed to create dorm" });
  }
});

// Rate a dorm
dorms.post("/:id/rate", async (req, res) => {
  try {
    const { rating, userId } = req.body;
    const dormId = req.params.id;

    // Check if dorm exists
    const dorm = await Dorm.findByPk(dormId);
    if (!dorm) {
      return res.status(404).json({ error: "Dorm not found" });
    }

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Use rating service to handle the rating logic
    const result = await RatingService.addOrUpdateRating(dormId, userId, rating);

    res.json({
      message: result.message,
      rating: result.rating,
      average_rating: result.statistics.average_rating,
      total_ratings: result.statistics.total_ratings
    });

  } catch (error) {
    console.error("Error rating dorm:", error);
    const statusCode = error.message.includes("must be between") ? 400 : 500;
    res.status(statusCode).json({ error: error.message || "Failed to rate dorm" });
  }
});

// Get ratings for a specific dorm
dorms.get("/:id/ratings", async (req, res) => {
  try {
    const ratings = await RatingService.getDormRatings(req.params.id);
    res.json(ratings);
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ error: "Failed to fetch ratings" });
  }
});

// Get rating distribution for a specific dorm
dorms.get("/:id/rating-distribution", async (req, res) => {
  try {
    const distribution = await RatingService.getRatingDistribution(req.params.id);
    res.json(distribution);
  } catch (error) {
    console.error("Error fetching rating distribution:", error);
    res.status(500).json({ error: "Failed to fetch rating distribution" });
  }
});

// Update dorm
dorms.put("/:id", async (req, res) => {
  try {
    const [updatedRowsCount] = await Dorm.update(req.body, {
      where: { id: req.params.id }
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({ error: "Dorm not found" });
    }

    const updatedDorm = await Dorm.findByPk(req.params.id);
    res.json(updatedDorm);
  } catch (error) {
    console.error("Error updating dorm:", error);
    res.status(500).json({ error: "Failed to update dorm" });
  }
});

// Delete dorm
dorms.delete("/:id", async (req, res) => {
  try {
    const deletedRowsCount = await Dorm.destroy({
      where: { id: req.params.id }
    });

    if (deletedRowsCount === 0) {
      return res.status(404).json({ error: "Dorm not found" });
    }

    res.json({ message: "Dorm deleted successfully" });
  } catch (error) {
    console.error("Error deleting dorm:", error);
    res.status(500).json({ error: "Failed to delete dorm" });
  }
});