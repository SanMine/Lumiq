import { Wishlist } from "../models/Wishlist.js";
import { Dorm } from "../models/Dorm.js";

export class WishlistService {
    /**
     * Add a dorm to user's wishlist
     * Returns existing entry if already in wishlist
     */
    static async addToWishlist(userId, dormId) {
        try {
            // Check if dorm exists
            const dorm = await Dorm.findById(dormId);
            if (!dorm) {
                throw new Error("Dorm not found");
            }

            // Check if already in wishlist
            let wishlistItem = await Wishlist.findOne({ userId, dormId });

            if (wishlistItem) {
                return {
                    success: true,
                    message: "Dorm already in wishlist",
                    wishlistItem,
                    alreadyExists: true,
                };
            }

            // Create new wishlist entry
            wishlistItem = await Wishlist.create({ userId, dormId });

            return {
                success: true,
                message: "Dorm added to wishlist",
                wishlistItem,
                alreadyExists: false,
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Remove a dorm from user's wishlist
     */
    static async removeFromWishlist(userId, dormId) {
        try {
            const wishlistItem = await Wishlist.findOneAndDelete({ userId, dormId });

            if (!wishlistItem) {
                throw new Error("Wishlist item not found");
            }

            return {
                success: true,
                message: "Dorm removed from wishlist",
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get all wishlist items for a user with populated dorm details
     */
    static async getUserWishlist(userId) {
        try {
            const wishlistItems = await Wishlist.find({ userId })
                .populate("dormId")
                .sort({ createdAt: -1 });

            // Filter out items where dorm was deleted
            const validItems = wishlistItems.filter(item => item.dormId !== null);

            return validItems;
        } catch (error) {
            throw new Error("Failed to fetch wishlist");
        }
    }

    /**
     * Check if a dorm is in user's wishlist
     */
    static async checkIfInWishlist(userId, dormId) {
        try {
            const wishlistItem = await Wishlist.findOne({ userId, dormId });
            return !!wishlistItem;
        } catch (error) {
            throw new Error("Failed to check wishlist status");
        }
    }

    /**
     * Clear all items from user's wishlist
     */
    static async clearWishlist(userId) {
        try {
            const result = await Wishlist.deleteMany({ userId });

            return {
                success: true,
                message: "Wishlist cleared",
                deletedCount: result.deletedCount,
            };
        } catch (error) {
            throw new Error("Failed to clear wishlist");
        }
    }

    /**
     * Get wishlist count for a user
     */
    static async getWishlistCount(userId) {
        try {
            const count = await Wishlist.countDocuments({ userId });
            return count;
        } catch (error) {
            throw new Error("Failed to get wishlist count");
        }
    }
}
