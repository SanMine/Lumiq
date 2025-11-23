import { Router } from "express";
import { WishlistService } from "../services/wishlistService.js";
import { requireAuth } from "../middlewares/auth.js";

export const wishlist = Router();

// Get user's wishlist (authenticated users only)
wishlist.get("/", requireAuth, async (req, res, next) => {
    try {
        const wishlistItems = await WishlistService.getUserWishlist(req.user.id);

        // Transform to include dorm details
        const formattedWishlist = wishlistItems.map(item => ({
            _id: item._id,
            dormId: item.dormId._id,
            name: item.dormId.name,
            address: item.dormId.address,
            fullAddress: item.dormId.fullAddress,
            image_url: item.dormId.image_url,
            price: item.dormId.price,
            description: item.dormId.description,
            facilities: item.dormId.facilities,
            latitude: item.dormId.latitude,
            longitude: item.dormId.longitude,
            addedAt: item.createdAt,
        }));

        res.json(formattedWishlist);
    } catch (error) {
        next(error);
    }
});

// Add dorm to wishlist (authenticated users only)
wishlist.post("/", requireAuth, async (req, res, next) => {
    try {
        const { dormId } = req.body;

        if (!dormId) {
            return res.status(400).json({ error: "Dorm ID is required" });
        }

        const result = await WishlistService.addToWishlist(req.user.id, dormId);

        res.status(result.alreadyExists ? 200 : 201).json({
            message: result.message,
            wishlistItem: result.wishlistItem,
        });
    } catch (error) {
        if (error.message === "Dorm not found") {
            return res.status(404).json({ error: error.message });
        }
        next(error);
    }
});

// Check if dorm is in wishlist (authenticated users only)
wishlist.get("/check/:dormId", requireAuth, async (req, res, next) => {
    try {
        const { dormId } = req.params;
        const isInWishlist = await WishlistService.checkIfInWishlist(
            req.user.id,
            dormId
        );

        res.json({ isInWishlist });
    } catch (error) {
        next(error);
    }
});

// Get wishlist count (authenticated users only)
wishlist.get("/count", requireAuth, async (req, res, next) => {
    try {
        const count = await WishlistService.getWishlistCount(req.user.id);
        res.json({ count });
    } catch (error) {
        next(error);
    }
});

// Remove dorm from wishlist (authenticated users only)
wishlist.delete("/:dormId", requireAuth, async (req, res, next) => {
    try {
        const { dormId } = req.params;

        const result = await WishlistService.removeFromWishlist(
            req.user.id,
            dormId
        );

        res.json({ message: result.message });
    } catch (error) {
        if (error.message === "Wishlist item not found") {
            return res.status(404).json({ error: error.message });
        }
        next(error);
    }
});

// Clear entire wishlist (authenticated users only)
wishlist.delete("/", requireAuth, async (req, res, next) => {
    try {
        const result = await WishlistService.clearWishlist(req.user.id);

        res.json({
            message: result.message,
            deletedCount: result.deletedCount,
        });
    } catch (error) {
        next(error);
    }
});
