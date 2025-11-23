/**
 * Roommate Matching Routes
 * Endpoints for finding compatible roommates using AI
 */

import express from 'express';
import { findRoommateMatches, getMatchingStats } from '../services/matchingService.js';
import { AiMatchingService } from '../services/aiMatchingService.js';
import { requireAuth, requireStudent } from '../middlewares/auth.js';

const router = express.Router();

/**
 * POST /api/matching/find-roommates/:userId
 * Find compatible roommates for a specific user
 */
router.post('/find-roommates/:userId', requireStudent, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const minMatchPercentage = parseInt(req.query.minMatch || 0);

    // Validate user ID
    if (isNaN(userId)) {
      return res.status(400).json({
        error: 'Invalid user ID',
      });
    }

    // Find matching roommates
    const matches = await findRoommateMatches(userId);

    // Filter by minimum match percentage if specified
    const filteredMatches =
      minMatchPercentage > 0
        ? matches.filter(m => m.matchPercentage >= minMatchPercentage)
        : matches;

    return res.status(200).json({
      success: true,
      userId,
      totalMatches: filteredMatches.length,
      minMatchPercentage,
      matches: filteredMatches,
    });
  } catch (error) {
    console.error('Error in find-roommates route:', error);
    return res.status(500).json({
      error: error.message || 'Failed to find roommate matches',
    });
  }
});

/**
 * GET /api/matching/stats/:userId
 * Get matching statistics for a user
 */
router.get('/stats/:userId', requireStudent, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const minMatchPercentage = parseInt(req.query.minMatch || 60);

    // Validate user ID
    if (isNaN(userId)) {
      return res.status(400).json({
        error: 'Invalid user ID',
      });
    }

    // Get matching statistics
    const stats = await getMatchingStats(userId, minMatchPercentage);

    return res.status(200).json({
      success: true,
      userId,
      stats,
    });
  } catch (error) {
    console.error('Error in stats route:', error);
    return res.status(500).json({
      error: error.message || 'Failed to get matching statistics',
    });
  }
});

/**
 * GET /api/matching/best-match/:userId
 * Get the best compatible roommate match
 */
router.get('/best-match/:userId', requireStudent, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    // Validate user ID
    if (isNaN(userId)) {
      return res.status(400).json({
        error: 'Invalid user ID',
      });
    }

    // Find matching roommates
    const matches = await findRoommateMatches(userId);

    if (matches.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No compatible roommates found',
      });
    }

    // Get the best match (first one, as they're sorted by percentage)
    const bestMatch = matches[0];

    return res.status(200).json({
      success: true,
      userId,
      bestMatch,
    });
  } catch (error) {
    console.error('Error in best-match route:', error);
    return res.status(500).json({
      error: error.message || 'Failed to find best match',
    });
  }
});

/**
 * POST /api/matching/compare/:userId/:candidateId
 * Compare two users for compatibility
 */
router.post('/compare/:userId/:candidateId', requireStudent, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const candidateId = parseInt(req.params.candidateId);

    // Validate IDs
    if (isNaN(userId) || isNaN(candidateId)) {
      return res.status(400).json({
        error: 'Invalid user IDs',
      });
    }

    if (userId === candidateId) {
      return res.status(400).json({
        error: 'Cannot compare user with themselves',
      });
    }

    // Find matches for the user
    const matches = await findRoommateMatches(userId);

    // Find the specific candidate in the matches
    const candidateMatch = matches.find(m => m.candidateId === candidateId);

    if (!candidateMatch) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found in matches',
      });
    }

    return res.status(200).json({
      success: true,
      userId,
      candidateId,
      compatibility: candidateMatch,
    });
  } catch (error) {
    console.error('Error in compare route:', error);
    return res.status(500).json({
      error: error.message || 'Failed to compare users',
    });
  }
});

/**
 * GET /api/matching/ai-analysis/:userId1/:userId2
 * Get AI-powered compatibility analysis between two users
 */
router.get('/ai-analysis/:userId1/:userId2', requireAuth, async (req, res) => {
  try {
    const userId1 = parseInt(req.params.userId1);
    const userId2 = parseInt(req.params.userId2);

    // Validate IDs
    if (isNaN(userId1) || isNaN(userId2)) {
      return res.status(400).json({
        error: 'Invalid user IDs',
      });
    }

    if (userId1 === userId2) {
      return res.status(400).json({
        error: 'Cannot analyze compatibility with yourself',
      });
    }

    // Get AI compatibility analysis
    const analysis = await AiMatchingService.analyzeCompatibility(userId1, userId2);

    return res.status(200).json({
      success: true,
      userId1,
      userId2,
      ...analysis,
    });
  } catch (error) {
    console.error('Error in ai-analysis route:', error);
    return res.status(500).json({
      error: error.message || 'Failed to analyze compatibility',
    });
  }
});

export default router;

