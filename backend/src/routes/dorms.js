import { Router } from "express";
import { Dorm } from "../models/Dorm.js";
import { Rating } from "../models/Rating.js";
import { User } from "../models/User.js";
import { sequelize } from "../../sequelize.js";

export const dorms = Router();

// Get all dorms with calculated average ratings
dorms.get("/", async (req, res) => {
  try {
    // First, get all dorms
    const allDorms = await Dorm.findAll({
      order: [["id", "ASC"]]
    });

    // Then, calculate ratings for each dorm
    const dormsWithRatings = await Promise.all(
      allDorms.map(async (dorm) => {
        const ratings = await Rating.findAll({
          where: { dormId: dorm.id },
          attributes: ['rating']
        });

        const totalRatings = ratings.length;
        const averageRating = totalRatings > 0 
          ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings 
          : (dorm.rating || 0);

        return {
          ...dorm.toJSON(),
          average_rating: parseFloat(averageRating).toFixed(1),
          total_ratings: totalRatings
        };
      })
    );

    res.json(dormsWithRatings);
  } catch (error) {
    console.error("Error fetching dorms:", error);
    res.status(500).json({ error: "Failed to fetch dorms" });
  }
});

// Get specific dorm with ratings
dorms.get("/:id", async (req, res) => {
  try {
    const dorm = await Dorm.findByPk(req.params.id, {
      attributes: [
        '*',
        [
          sequelize.fn('AVG', sequelize.col('Ratings.rating')),
          'calculated_avg_rating'
        ],
        [
          sequelize.fn('COUNT', sequelize.col('Ratings.rating')),
          'calculated_total_ratings'
        ]
      ],
      include: [{
        model: Rating,
        attributes: [],
        include: [{
          model: User,
          attributes: ['name']
        }]
      }],
      group: ['Dorm.id']
    });

    if (!dorm) {
      return res.status(404).json({ error: "Dorm not found" });
    }

    const plain = dorm.get({ plain: true });
    const result = {
      ...plain,
      average_rating: plain.calculated_avg_rating ? parseFloat(plain.calculated_avg_rating).toFixed(1) : plain.rating,
      total_ratings: parseInt(plain.calculated_total_ratings) || 0
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

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

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

    // Use upsert to handle update or create
    const [ratingRecord, created] = await Rating.upsert({
      rating,
      userId,
      dormId
    }, {
      returning: true
    });

    // Calculate new average rating
    const avgResult = await Rating.findOne({
      where: { dormId },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'avg_rating'],
        [sequelize.fn('COUNT', sequelize.col('rating')), 'total_ratings']
      ],
      raw: true
    });

    res.json({
      message: created ? "Rating added successfully" : "Rating updated successfully",
      rating: ratingRecord,
      average_rating: parseFloat(avgResult.avg_rating).toFixed(1),
      total_ratings: parseInt(avgResult.total_ratings)
    });

  } catch (error) {
    console.error("Error rating dorm:", error);
    res.status(500).json({ error: "Failed to rate dorm" });
  }
});

// Get ratings for a specific dorm
dorms.get("/:id/ratings", async (req, res) => {
  try {
    const ratings = await Rating.findAll({
      where: { dormId: req.params.id },
      include: [{
        model: User,
        attributes: ['name', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(ratings);
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ error: "Failed to fetch ratings" });
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