// 🏭 JWT TOKEN FACTORY - Creates and verifies digital ID badges
import jwt from "jsonwebtoken";

// 🔐 Secret key for creating tokens (like the building master key)
// In production, this should be a long, random string stored in .env
const JWT_SECRET = process.env.JWT_SECRET || "lumiq-secret-key-change-in-production";

// ⏰ How long tokens are valid (24 hours)
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

// 🏭 FUNCTION: Create a new digital ID badge (JWT token)
// Takes user information and creates a secure token they can use
export function generateToken(user) {
  // Think of this like printing a special ID badge for an apartment resident
  // The badge contains:
  const payload = {
    userId: user.id,           // Their apartment number (user ID)
    email: user.email,         // Their name on the mailbox
    role: user.role           // Are they a resident, admin, or building owner?
  };
  
  // jwt.sign() is like using a special stamp machine that creates unforgeable badges
  // JWT_SECRET is like the special ink that only our building can make
  // JWT_EXPIRES_IN means the badge expires after 24 hours (for security)
  const token = jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRES_IN 
  });
  
  return token;
}

// 🔍 FUNCTION: Check if a digital ID badge is real and valid
// Takes a token and tells us who the person is (if the badge is valid)
export function verifyToken(token) {
  try {
    // jwt.verify() is like using a special scanner to check if the badge is real
    // If the badge was made with our special ink (JWT_SECRET), it's valid
    // If someone tried to fake it or it's expired, this will fail
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // If we get here, the badge is valid! Return the user info
    return {
      success: true,
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
  } catch (error) {
    // If we get here, the badge is fake, expired, or damaged
    // Return an error so the security guard knows to deny access
    return {
      success: false,
      error: error.message  // "expired", "invalid signature", etc.
    };
  }
}

// 📄 FUNCTION: Extract token from HTTP request headers
// Browsers send tokens in the "Authorization: Bearer xyz123..." header
export function extractTokenFromHeader(authHeader) {
  // The header looks like: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  // We need to remove the "Bearer " part and get just the token
  
  if (!authHeader) {
    return null;  // No authorization header found
  }
  
  if (!authHeader.startsWith('Bearer ')) {
    return null;  // Wrong format (should start with "Bearer ")
  }
  
  // Remove "Bearer " from the beginning and return just the token
  // "Bearer abc123" becomes "abc123"
  const token = authHeader.substring(7); // "Bearer ".length = 7
  return token;
}

// 🎯 FUNCTION: Get user info from request header (combines extract + verify)
// This is what we'll use in our middleware to check who's making the request
export function getUserFromToken(authHeader) {
  // Step 1: Extract the token from the header
  const token = extractTokenFromHeader(authHeader);
  
  if (!token) {
    return { success: false, error: 'No token provided' };
  }
  
  // Step 2: Verify the token and get user info
  const result = verifyToken(token);
  
  return result;
}
