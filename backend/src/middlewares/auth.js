// 🛡️ SECURITY CHECKPOINT MIDDLEWARE
// These are like security guards posted at different entrances

import { getUserFromToken } from "../utils/auth.js";
import { User } from "../models/User.js";

// 🚪 MAIN SECURITY CHECKPOINT: Check if someone has a valid ID badge
// This middleware runs before protected routes to verify authentication
export function requireAuth(req, res, next) {
  // Get the Authorization header from the request
  // This is where the frontend sends the JWT token
  const authHeader = req.headers.authorization;
  
  // Use our token checker to see who this person is
  const tokenResult = getUserFromToken(authHeader);
  
  // If the token is invalid, expired, or missing, deny access
  if (!tokenResult.success) {
    return res.status(401).json({ 
      error: 'Authentication required',
      message: tokenResult.error 
    });
  }
  
  // If we get here, the token is valid! 
  // Store the user info in req.user so other functions can use it
  req.user = {
    id: tokenResult.userId,
    email: tokenResult.email,
    role: tokenResult.role
  };
  
  // Call next() to let the request continue to the actual route handler
  // It's like saying "This person has a valid badge, let them through"
  next();
}

// 🎓 STUDENT-ONLY CHECKPOINT: Only allow students through
// Use this for routes that only students should access
export function requireStudent(req, res, next) {
  // First check if they have any valid badge at all
  requireAuth(req, res, (err) => {
    if (err) return next(err);  // If authentication failed, stop here
    
    // Check if they're a student
    if (req.user.role !== 'student') {
      return res.status(403).json({ 
        error: 'Student access required',
        message: 'This feature is only available to students' 
      });
    }
    
    // They're an authenticated student, let them through
    next();
  });
}

// 👑 ADMIN-ONLY CHECKPOINT: Only allow admins through  
// Use this for routes that only admins should access
export function requireAdmin(req, res, next) {
  // First check if they have any valid badge at all
  requireAuth(req, res, (err) => {
    if (err) return next(err);  // If authentication failed, stop here
    
    // Check if they're an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Admin access required',
        message: 'This feature is only available to administrators' 
      });
    }
    
    // They're an authenticated admin, let them through
    next();
  });
}

// 🏠 DORM OWNER CHECKPOINT: Only allow dorm owners through
// Use this for routes where dorm owners manage their properties
export function requireDormOwner(req, res, next) {
  // First check if they have any valid badge at all
  requireAuth(req, res, (err) => {
    if (err) return next(err);  // If authentication failed, stop here
    
    // Check if they're a dorm owner
    if (req.user.role !== 'dorm_owner') {
      return res.status(403).json({ 
        error: 'Dorm owner access required',
        message: 'This feature is only available to dorm owners' 
      });
    }
    
    // They're an authenticated dorm owner, let them through
    next();
  });
}

// 🏢 DORM ADMIN CHECKPOINT: Only allow dorm admins through
// Use this for routes where dorm admins manage dorms
export function requireDormAdmin(req, res, next) {
  // First check if they have any valid badge at all
  requireAuth(req, res, (err) => {
    if (err) return next(err);  // If authentication failed, stop here
    
    // Check if they're a dorm admin
    if (req.user.role !== 'dorm_admin') {
      return res.status(403).json({ 
        error: 'Dorm admin access required',
        message: 'This feature is only available to dorm administrators' 
      });
    }
    
    // They're an authenticated dorm admin, let them through
    next();
  });
}

// 🔓 OPTIONAL AUTHENTICATION: Check badge if present, but don't require it
// Use this for routes where login enhances the experience but isn't required
export function optionalAuth(req, res, next) {
  // Get the Authorization header from the request
  const authHeader = req.headers.authorization;
  
  // If no header is provided, that's okay - just continue without user info
  if (!authHeader) {
    req.user = null;  // No user logged in
    return next();
  }
  
  // If header is provided, try to get user info from token
  const tokenResult = getUserFromToken(authHeader);
  
  if (tokenResult.success) {
    // Valid token - store user info
    req.user = {
      id: tokenResult.userId,
      email: tokenResult.email,
      role: tokenResult.role
    };
  } else {
    // Invalid token - that's okay for optional auth, just continue without user
    req.user = null;
  }
  
  // Continue to the route handler whether token was valid or not
  next();
}

// 🆔 MIDDLEWARE: Get full user object from database
// Use this after requireAuth when you need complete user information
export async function getUserFromDB(req, res, next) {
  try {
    // req.user.id comes from the JWT token (set by requireAuth middleware)
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      // This should rarely happen - it means the user was deleted after login
      return res.status(401).json({ 
        error: 'User not found',
        message: 'Your account may have been deleted. Please log in again.' 
      });
    }
    
    // Replace the basic token info with full user object from database
    req.user = user;
    next();
  } catch (error) {
    next(error);  // Pass database errors to error handler
  }
}
