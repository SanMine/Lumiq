import { Rating } from "../models/Rating.js";
import { User } from "../models/User.js";
import { sequelize } from "../../sequelize.js";

/**
 * Rating Service - Handles all rating calculation and management logic
 */
export class RatingService {
  
  /**
   * Calculate ratings for a single dorm
   * @param {number} dormId - The ID of the dorm
   * @returns {Object} Object containing average_rating and total_ratings
   */
  static async calculateDormRating(dormId) {
    try {
      const ratings = await Rating.findAll({
        where: { dormId },
        attributes: ['rating']
      });

      const totalRatings = ratings.length;
      const averageRating = totalRatings > 0 
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings 
        : 0;

      return {
        average_rating: parseFloat(averageRating).toFixed(1),
        total_ratings: totalRatings
      };
    } catch (error) {
      console.error("Error calculating dorm rating:", error);
      throw new Error("Failed to calculate dorm rating");
    }
  }

  /**
   * Calculate ratings for multiple dorms
   * @param {Array} dorms - Array of dorm objects
   * @returns {Array} Array of dorms with calculated ratings
   */
  static async calculateMultipleDormRatings(dorms) {
    try {
      return await Promise.all(
        dorms.map(async (dorm) => {
          const ratingData = await this.calculateDormRating(dorm.id);
          
          return {
            ...dorm.toJSON(),
            average_rating: ratingData.average_rating,
            total_ratings: ratingData.total_ratings
          };
        })
      );
    } catch (error) {
      console.error("Error calculating multiple dorm ratings:", error);
      throw new Error("Failed to calculate dorm ratings");
    }
  }

  /**
   * Get detailed rating statistics for a dorm using SQL aggregation
   * @param {number} dormId - The ID of the dorm
   * @returns {Object} Detailed rating statistics
   */
  static async getDormRatingStatistics(dormId) {
    try {
      const result = await Rating.findOne({
        where: { dormId },
        attributes: [
          [sequelize.fn('AVG', sequelize.col('rating')), 'avg_rating'],
          [sequelize.fn('COUNT', sequelize.col('rating')), 'total_ratings'],
          [sequelize.fn('MIN', sequelize.col('rating')), 'min_rating'],
          [sequelize.fn('MAX', sequelize.col('rating')), 'max_rating']
        ],
        raw: true
      });

      if (!result || !result.total_ratings) {
        return {
          average_rating: "0.0",
          total_ratings: 0,
          min_rating: 0,
          max_rating: 0
        };
      }

      return {
        average_rating: parseFloat(result.avg_rating).toFixed(1),
        total_ratings: parseInt(result.total_ratings),
        min_rating: parseInt(result.min_rating),
        max_rating: parseInt(result.max_rating)
      };
    } catch (error) {
      console.error("Error getting dorm rating statistics:", error);
      throw new Error("Failed to get rating statistics");
    }
  }

  /**
   * Add or update a rating for a dorm
   * @param {number} dormId - The ID of the dorm
   * @param {number} userId - The ID of the user
   * @param {number} rating - The rating value (1-5)
   * @returns {Object} Rating operation result
   */
  static async addOrUpdateRating(dormId, userId, rating) {
    try {
      // Validate rating
      if (!rating || rating < 1 || rating > 5) {
        throw new Error("Rating must be between 1 and 5");
      }

      // Use upsert to handle update or create
      const [ratingRecord, created] = await Rating.upsert({
        rating,
        userId,
        dormId
      }, {
        returning: true
      });

      // Calculate new statistics
      const stats = await this.getDormRatingStatistics(dormId);

      return {
        success: true,
        message: created ? "Rating added successfully" : "Rating updated successfully",
        rating: ratingRecord,
        statistics: stats
      };
    } catch (error) {
      console.error("Error adding/updating rating:", error);
      throw error;
    }
  }

  /**
   * Get all ratings for a specific dorm with user information
   * @param {number} dormId - The ID of the dorm
   * @returns {Array} Array of ratings with user information
   */
  static async getDormRatings(dormId) {
    try {
      return await Rating.findAll({
        where: { dormId },
        include: [{
          model: User,
          attributes: ['name', 'email']
        }],
        order: [['createdAt', 'DESC']]
      });
    } catch (error) {
      console.error("Error fetching dorm ratings:", error);
      throw new Error("Failed to fetch dorm ratings");
    }
  }

  /**
   * Get rating distribution for a dorm (how many 1-star, 2-star, etc.)
   * @param {number} dormId - The ID of the dorm
   * @returns {Object} Rating distribution
   */
  static async getRatingDistribution(dormId) {
    try {
      const distribution = await Rating.findAll({
        where: { dormId },
        attributes: [
          'rating',
          [sequelize.fn('COUNT', sequelize.col('rating')), 'count']
        ],
        group: ['rating'],
        order: [['rating', 'ASC']],
        raw: true
      });

      // Initialize all rating levels
      const result = {
        1: 0, 2: 0, 3: 0, 4: 0, 5: 0
      };

      // Fill in actual counts
      distribution.forEach(item => {
        result[item.rating] = parseInt(item.count);
      });

      return result;
    } catch (error) {
      console.error("Error getting rating distribution:", error);
      throw new Error("Failed to get rating distribution");
    }
  }
}
