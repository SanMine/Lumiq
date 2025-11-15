import { Rating } from "../models/Rating.js";
import { User } from "../models/User.js";

export class RatingService {
  static async calculateDormRating(dormId) {
    try {
      const ratings = await Rating.find({ dormId }).select("rating");
      const totalRatings = ratings.length;
      const averageRating = totalRatings > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
        : 0;
      return {
        average_rating: parseFloat(averageRating).toFixed(1),
        total_ratings: totalRatings,
      };
    } catch (error) {
      throw new Error("Failed to calculate dorm rating");
    }
  }

  static async calculateMultipleDormRatings(dorms) {
    try {
      return await Promise.all(
        dorms.map(async (dorm) => {
          const ratingData = await this.calculateDormRating(dorm._id.toString());
          return {
            ...dorm.toObject(),
            average_rating: ratingData.average_rating,
            total_ratings: ratingData.total_ratings,
          };
        })
      );
    } catch (error) {
      throw new Error("Failed to calculate dorm ratings");
    }
  }

  static async getDormRatingStatistics(dormId) {
    try {
      const ratings = await Rating.find({ dormId }).select("rating");
      if (ratings.length === 0) {
        return {
          average_rating: "0.0",
          total_ratings: 0,
          min_rating: 0,
          max_rating: 0,
        };
      }
      const ratingValues = ratings.map((r) => r.rating);
      const avgRating = ratingValues.reduce((a, b) => a + b) / ratingValues.length;
      return {
        average_rating: parseFloat(avgRating).toFixed(1),
        total_ratings: ratings.length,
        min_rating: Math.min(...ratingValues),
        max_rating: Math.max(...ratingValues),
      };
    } catch (error) {
      throw new Error("Failed to get rating statistics");
    }
  }

  static async addOrUpdateRating(dormId, userId, rating) {
    try {
      if (!rating || rating < 1 || rating > 5) {
        throw new Error("Rating must be between 1 and 5");
      }
      let ratingRecord = await Rating.findOne({ dormId, userId });
      let created = false;
      if (!ratingRecord) {
        ratingRecord = await Rating.create({ rating, userId, dormId });
        created = true;
      } else {
        ratingRecord.rating = rating;
        await ratingRecord.save();
      }
      const stats = await this.getDormRatingStatistics(dormId);
      return {
        success: true,
        message: created ? "Rating added successfully" : "Rating updated successfully",
        rating: ratingRecord,
        statistics: stats,
      };
    } catch (error) {
      throw error;
    }
  }

  static async getDormRatings(dormId) {
    try {
      return await Rating.find({ dormId })
        .populate("userId", "name email")
        .sort({ createdAt: -1 });
    } catch (error) {
      throw new Error("Failed to fetch dorm ratings");
    }
  }

  static async getRatingDistribution(dormId) {
    try {
      const ratings = await Rating.find({ dormId }).select("rating");
      const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      ratings.forEach((r) => {
        distribution[r.rating]++;
      });
      return distribution;
    } catch (error) {
      throw new Error("Failed to get rating distribution");
    }
  }
}
