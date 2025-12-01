// 🔐 GOOGLE OAUTH ROUTES (Direct mount, no /api prefix to match Google Console configuration)
import { Router } from "express";
import passport from "passport";
import { generateToken } from "../utils/auth.js";

export const googleAuth = Router();

// '/google'
// Initiate Google OAuth flow
googleAuth.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

// '/google/callback'
// Handle Google OAuth callback
googleAuth.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/auth/sign-in",
        session: false, // We're using JWT, not sessions for auth
    }),
    (req, res) => {
        try {
            if (!req.user) {
                throw new Error("No user object in request");
            }

            // Ensure user object has id property (Mongoose uses _id)
            const userForToken = {
                id: req.user._id,
                email: req.user.email,
                role: req.user.role
            };

            // Generate JWT token for the authenticated user
            const token = generateToken(userForToken);

            // Determine frontend URL based on environment
            const frontendURL = process.env.FRONTEND_URL || "http://localhost:3000";

            // Redirect to frontend with token in URL
            res.redirect(`${frontendURL}/auth/google/callback?token=${token}`);
        } catch (error) {
            console.error("Google OAuth callback error:", error.message);
            const frontendURL = process.env.FRONTEND_URL || "http://localhost:3000";
            res.redirect(`${frontendURL}/auth/sign-in?error=oauth_failed`);
        }
    }
);
