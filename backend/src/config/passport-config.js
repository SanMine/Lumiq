// 🔐 PASSPORT GOOGLE OAUTH CONFIGURATION
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/User.js";

// 📋 Configure Google OAuth Strategy
const configureGoogleOAuth = () => {
    // Determine callback URL based on environment
    const callbackURL = process.env.NODE_ENV === "production"
        ? process.env.GOOGLE_CALLBACK_URL_PROD
        : process.env.GOOGLE_CALLBACK_URL_LOCAL;

    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: callbackURL,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    // Extract user info from Google profile
                    const email = profile.emails[0].value;
                    const name = profile.displayName;

                    // Check if user already exists
                    let user = await User.findOne({ email: email.toLowerCase() });

                    if (user) {
                        // User exists - return existing user
                        return done(null, user);
                    }

                    // User doesn't exist - create new user
                    user = await User.create({
                        email: email.toLowerCase(),
                        name: name,
                        passwordHash: null, // No password for Google-authenticated users
                        role: "student", // Default role
                    });

                    return done(null, user);
                } catch (error) {
                    return done(error, null);
                }
            }
        )
    );

    // Serialize user for session (not heavily used with JWT, but required by Passport)
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    // Deserialize user from session
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error, false);
        }
    });
};

export default configureGoogleOAuth;
