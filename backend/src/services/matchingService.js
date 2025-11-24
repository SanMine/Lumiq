/**
 * User Matching Service using Algorithmic Bidirectional Matching
 * Finds compatible roommates based on personality and preferences
 * 
 * Matching Logic:
 * 1. First Check: User A Preferences → User B Personality (must be >= 60%)
 * 2. Second Check: User A Personality → User B Preferences (if first check passes)
 * 3. Final Score: Average of both checks if both pass
 */

import { User } from '../models/User.js';
import { User_personality } from '../models/User_personality.js';
import { Preferred_roommate } from '../models/Preferred_roommate.js';
import { Knock } from '../models/Knock.js';

/**
 * Find compatible roommates for a user using algorithmic bidirectional matching
 * @param {Number} userId - The user ID to find matches for
 * @returns {Promise<Array>} Array of matched users with compatibility scores
 */
export async function findRoommateMatches(userId) {
  try {
    // Get the target user's data
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Get target user's personality
    const targetPersonality = await User_personality.findOne({ userId });
    if (!targetPersonality) {
      throw new Error(`Personality profile not found for user ${userId}`);
    }

    // Get target user's preferences
    const targetPreferences = await Preferred_roommate.findOne({ userId });
    if (!targetPreferences) {
      throw new Error(`Roommate preferences not found for user ${userId}`);
    }

    // Get all other users
    const allUsers = await User.find({ _id: { $ne: userId } });

    // Get personalities for all other users who are open for roommate matching
    const personalities = await User_personality.find({
      userId: { $in: allUsers.map(u => u._id) },
      openForRoommateMatching: true, // Only include users open for matching
    });

    // Get preferences for all other users
    const allPreferences = await Preferred_roommate.find({
      userId: { $in: allUsers.map(u => u._id) },
    });

    // Create maps for quick lookup
    const personalityMap = {};
    personalities.forEach(p => {
      personalityMap[p.userId] = p;
    });

    const preferenceMap = {};
    allPreferences.forEach(p => {
      preferenceMap[p.userId] = p;
    });

    // Get all knocks for the current user to filter out connected users
    const userKnocks = await Knock.find({
      $or: [
        { senderId: userId },
        { recipientId: userId }
      ]
    });

    // Get IDs of users with accepted connections
    const connectedUserIds = new Set();
    userKnocks.forEach(knock => {
      if (knock.status === 'accepted') {
        // Add the other user in the knock to the connected list
        if (knock.senderId === userId) {
          connectedUserIds.add(knock.recipientId);
        } else {
          connectedUserIds.add(knock.senderId);
        }
      }
    });

    // Filter users who have both personality and preference profiles
    // AND are not already connected
    const candidateUsers = allUsers.filter(u =>
      personalityMap[u._id] && preferenceMap[u._id] && !connectedUserIds.has(u._id)
    );

    if (candidateUsers.length === 0) {
      return [];
    }

    // Analyze compatibility for each candidate
    const matches = [];

    for (const candidate of candidateUsers) {
      const candidatePersonality = personalityMap[candidate._id];
      const candidatePreferences = preferenceMap[candidate._id];

      // STEP 1: Check User A Preferences → User B Personality
      const preferencesMatch = calculatePreferenceToPersonalityMatch(
        targetPreferences,
        candidatePersonality
      );

      // Only proceed if first check passes 60% threshold
      if (preferencesMatch.score >= 60) {
        // STEP 2: Check User A Personality → User B Preferences
        const personalityMatch = calculatePersonalityToPreferenceMatch(
          targetPersonality,
          candidatePreferences
        );

        // Calculate average match percentage
        const averageMatchPercentage = Math.round(
          (preferencesMatch.score + personalityMatch.score) / 2
        );

        // Create match result
        matches.push({
          candidateId: candidate._id,
          candidateName: candidate.name,
          matchPercentage: averageMatchPercentage,
          compatibility: {
            personalityMatch: personalityMatch.summary,
            lifestyleMatch: preferencesMatch.summary,
            preferenceMatch: `Your preferences match their personality at ${preferencesMatch.score}%. Their preferences match your personality at ${personalityMatch.score}%.`,
            overallReason: generateOverallReason(
              averageMatchPercentage,
              preferencesMatch,
              personalityMatch
            ),
          },
          detailedScores: {
            yourPreferencesVsTheirPersonality: preferencesMatch.score,
            yourPersonalityVsTheirPreferences: personalityMatch.score,
            breakdown: {
              preferencesMatchDetails: preferencesMatch.details,
              personalityMatchDetails: personalityMatch.details,
            },
          },
        });
      }
    }

    // Sort by match percentage (highest first)
    matches.sort((a, b) => b.matchPercentage - a.matchPercentage);

    return matches;
  } catch (error) {
    console.error('Error in findRoommateMatches:', error);
    throw error;
  }
}

/**
 * Calculate match between User A's Preferences and User B's Personality
 * This is the FIRST check - must be >= 60% to proceed
 * @param {Object} preferences - User A's preferences
 * @param {Object} personality - User B's personality
 * @returns {Object} Score and detailed reasons
 */
function calculatePreferenceToPersonalityMatch(preferences, personality) {
  const scores = [];
  const details = [];

  // Age Range Check (Weight: 10)
  const ageInRange = personality.age >= preferences.preferred_age_range.min &&
    personality.age <= preferences.preferred_age_range.max;
  if (ageInRange) {
    scores.push(10);
    details.push(`✓ Age ${personality.age} is within your preferred range (${preferences.preferred_age_range.min}-${preferences.preferred_age_range.max})`);
  } else {
    scores.push(0);
    details.push(`✗ Age ${personality.age} is outside your preferred range (${preferences.preferred_age_range.min}-${preferences.preferred_age_range.max})`);
  }

  // Gender Check (Weight: 10)
  if (preferences.preferred_gender === 'Any' || preferences.preferred_gender === personality.gender) {
    scores.push(10);
    details.push(`✓ Gender ${personality.gender} matches your preference`);
  } else {
    scores.push(0);
    details.push(`✗ Gender ${personality.gender} doesn't match your preference (${preferences.preferred_gender})`);
  }

  // Sleep Type Check (Weight: 10)
  if (preferences.preferred_sleep_type === 'Any' || preferences.preferred_sleep_type === personality.sleep_type) {
    scores.push(10);
    details.push(`✓ Sleep type ${personality.sleep_type} matches your preference`);
  } else {
    scores.push(5);
    details.push(`~ Sleep type ${personality.sleep_type} differs from your preference (${preferences.preferred_sleep_type})`);
  }

  // MBTI Check (Weight: 10)
  if (preferences.preferred_MBTI === 'Any' || preferences.preferred_MBTI === personality.MBTI) {
    scores.push(10);
    details.push(`✓ MBTI ${personality.MBTI} matches your preference`);
  } else {
    scores.push(5);
    details.push(`~ MBTI ${personality.MBTI} differs from your preference (${preferences.preferred_MBTI})`);
  }

  // Cleanliness Check (Weight: 10)
  if (preferences.preferred_cleanliness === personality.cleanliness) {
    scores.push(10);
    details.push(`✓ Cleanliness level ${personality.cleanliness} perfectly matches`);
  } else {
    const cleanlinessLevels = ['Messy', 'Moderate', 'Tidy'];
    const prefIndex = cleanlinessLevels.indexOf(preferences.preferred_cleanliness);
    const persIndex = cleanlinessLevels.indexOf(personality.cleanliness);
    if (Math.abs(prefIndex - persIndex) === 1) {
      scores.push(7);
      details.push(`~ Cleanliness ${personality.cleanliness} is close to your preference (${preferences.preferred_cleanliness})`);
    } else {
      scores.push(3);
      details.push(`✗ Cleanliness ${personality.cleanliness} differs significantly from your preference (${preferences.preferred_cleanliness})`);
    }
  }

  // Smoking Check (Weight: 10)
  const smokingMatch = (preferences.preferred_smoking === personality.smoking);
  if (smokingMatch) {
    scores.push(10);
    details.push(`✓ Smoking preference matches (${personality.smoking ? 'Yes' : 'No'})`);
  } else {
    scores.push(0);
    details.push(`✗ Smoking preference doesn't match (you prefer ${preferences.preferred_smoking ? 'smoker' : 'non-smoker'}, they are ${personality.smoking ? 'smoker' : 'non-smoker'})`);
  }

  // Pets Check (Weight: 10)
  // Note: personality.pets is a string, need to convert to boolean logic
  const hasPets = personality.pets && personality.pets !== 'No Pets' && personality.pets !== 'Allergic' && personality.pets !== 'Do not like pets';
  const petsMatch = (preferences.preferred_pets === hasPets);
  if (petsMatch) {
    scores.push(10);
    details.push(`✓ Pet preference matches (${personality.pets})`);
  } else {
    scores.push(3);
    details.push(`~ Pet preference differs (you prefer ${preferences.preferred_pets ? 'with pets' : 'no pets'}, they have: ${personality.pets})`);
  }

  // Noise Tolerance Check (Weight: 10)
  if (preferences.preferred_noise_tolerance === 'Flexible' ||
    personality.noise_tolerance === 'Flexible' ||
    preferences.preferred_noise_tolerance === personality.noise_tolerance) {
    scores.push(10);
    details.push(`✓ Noise tolerance ${personality.noise_tolerance} is compatible`);
  } else {
    scores.push(5);
    details.push(`~ Noise tolerance ${personality.noise_tolerance} differs from your preference (${preferences.preferred_noise_tolerance})`);
  }

  // Temperature Check (Weight: 10)
  if (preferences.preferred_temperature === 'Flexible' ||
    personality.temperature === 'Flexible' ||
    preferences.preferred_temperature === personality.temperature) {
    scores.push(10);
    details.push(`✓ Temperature preference ${personality.temperature} is compatible`);
  } else {
    scores.push(5);
    details.push(`~ Temperature preference ${personality.temperature} differs from yours (${preferences.preferred_temperature})`);
  }

  // Nationality Check (Weight: 10) - Optional
  if (!preferences.preferred_nationality || preferences.preferred_nationality === '' ||
    preferences.preferred_nationality === personality.nationality) {
    scores.push(10);
    details.push(`✓ Nationality compatible`);
  } else {
    scores.push(5);
    details.push(`~ Nationality differs from your preference`);
  }

  // Calculate final score
  const totalScore = scores.reduce((sum, score) => sum + score, 0);
  const maxScore = scores.length * 10;
  const finalScore = Math.round((totalScore / maxScore) * 100);

  return {
    score: finalScore,
    details: details,
    summary: `Their personality matches ${finalScore}% of your preferences. ${finalScore >= 80 ? 'Excellent match!' : finalScore >= 60 ? 'Good compatibility.' : 'Some differences exist.'}`
  };
}

/**
 * Calculate match between User A's Personality and User B's Preferences
 * This is the SECOND check - only called if first check passes
 * @param {Object} personality - User A's personality
 * @param {Object} preferences - User B's preferences
 * @returns {Object} Score and detailed reasons
 */
function calculatePersonalityToPreferenceMatch(personality, preferences) {
  const scores = [];
  const details = [];

  // Age Range Check
  const ageInRange = personality.age >= preferences.preferred_age_range.min &&
    personality.age <= preferences.preferred_age_range.max;
  if (ageInRange) {
    scores.push(10);
    details.push(`✓ Your age ${personality.age} fits their preferred range (${preferences.preferred_age_range.min}-${preferences.preferred_age_range.max})`);
  } else {
    scores.push(0);
    details.push(`✗ Your age ${personality.age} is outside their preferred range (${preferences.preferred_age_range.min}-${preferences.preferred_age_range.max})`);
  }

  // Gender Check
  if (preferences.preferred_gender === 'Any' || preferences.preferred_gender === personality.gender) {
    scores.push(10);
    details.push(`✓ Your gender ${personality.gender} matches their preference`);
  } else {
    scores.push(0);
    details.push(`✗ Your gender ${personality.gender} doesn't match their preference (${preferences.preferred_gender})`);
  }

  // Sleep Type Check
  if (preferences.preferred_sleep_type === 'Any' || preferences.preferred_sleep_type === personality.sleep_type) {
    scores.push(10);
    details.push(`✓ Your sleep type ${personality.sleep_type} matches their preference`);
  } else {
    scores.push(5);
    details.push(`~ Your sleep type ${personality.sleep_type} differs from their preference (${preferences.preferred_sleep_type})`);
  }

  // MBTI Check
  if (preferences.preferred_MBTI === 'Any' || preferences.preferred_MBTI === personality.MBTI) {
    scores.push(10);
    details.push(`✓ Your MBTI ${personality.MBTI} matches their preference`);
  } else {
    scores.push(5);
    details.push(`~ Your MBTI ${personality.MBTI} differs from their preference (${preferences.preferred_MBTI})`);
  }

  // Cleanliness Check
  if (preferences.preferred_cleanliness === personality.cleanliness) {
    scores.push(10);
    details.push(`✓ Your cleanliness level ${personality.cleanliness} perfectly matches`);
  } else {
    const cleanlinessLevels = ['Messy', 'Moderate', 'Tidy'];
    const prefIndex = cleanlinessLevels.indexOf(preferences.preferred_cleanliness);
    const persIndex = cleanlinessLevels.indexOf(personality.cleanliness);
    if (Math.abs(prefIndex - persIndex) === 1) {
      scores.push(7);
      details.push(`~ Your cleanliness ${personality.cleanliness} is close to their preference (${preferences.preferred_cleanliness})`);
    } else {
      scores.push(3);
      details.push(`✗ Your cleanliness ${personality.cleanliness} differs significantly from their preference (${preferences.preferred_cleanliness})`);
    }
  }

  // Smoking Check
  const smokingMatch = (preferences.preferred_smoking === personality.smoking);
  if (smokingMatch) {
    scores.push(10);
    details.push(`✓ Your smoking habit matches their preference (${personality.smoking ? 'Yes' : 'No'})`);
  } else {
    scores.push(0);
    details.push(`✗ Your smoking habit doesn't match their preference (they prefer ${preferences.preferred_smoking ? 'smoker' : 'non-smoker'}, you are ${personality.smoking ? 'smoker' : 'non-smoker'})`);
  }

  // Pets Check
  const hasPets = personality.pets && personality.pets !== 'No Pets' && personality.pets !== 'Allergic' && personality.pets !== 'Do not like pets';
  const petsMatch = (preferences.preferred_pets === hasPets);
  if (petsMatch) {
    scores.push(10);
    details.push(`✓ Your pet situation matches their preference (${personality.pets})`);
  } else {
    scores.push(3);
    details.push(`~ Your pet situation differs from their preference (they prefer ${preferences.preferred_pets ? 'with pets' : 'no pets'}, you have: ${personality.pets})`);
  }

  // Noise Tolerance Check
  if (preferences.preferred_noise_tolerance === 'Flexible' ||
    personality.noise_tolerance === 'Flexible' ||
    preferences.preferred_noise_tolerance === personality.noise_tolerance) {
    scores.push(10);
    details.push(`✓ Your noise tolerance ${personality.noise_tolerance} is compatible with their preference`);
  } else {
    scores.push(5);
    details.push(`~ Your noise tolerance ${personality.noise_tolerance} differs from their preference (${preferences.preferred_noise_tolerance})`);
  }

  // Temperature Check
  if (preferences.preferred_temperature === 'Flexible' ||
    personality.temperature === 'Flexible' ||
    preferences.preferred_temperature === personality.temperature) {
    scores.push(10);
    details.push(`✓ Your temperature preference ${personality.temperature} is compatible with theirs`);
  } else {
    scores.push(5);
    details.push(`~ Your temperature preference ${personality.temperature} differs from theirs (${preferences.preferred_temperature})`);
  }

  // Nationality Check - Optional
  if (!preferences.preferred_nationality || preferences.preferred_nationality === '' ||
    preferences.preferred_nationality === personality.nationality) {
    scores.push(10);
    details.push(`✓ Nationality compatible`);
  } else {
    scores.push(5);
    details.push(`~ Nationality differs from their preference`);
  }

  // Calculate final score
  const totalScore = scores.reduce((sum, score) => sum + score, 0);
  const maxScore = scores.length * 10;
  const finalScore = Math.round((totalScore / maxScore) * 100);

  return {
    score: finalScore,
    details: details,
    summary: `Your personality matches ${finalScore}% of their preferences. ${finalScore >= 80 ? 'Excellent mutual match!' : finalScore >= 60 ? 'Good mutual compatibility.' : 'Some differences exist.'}`
  };
}

/**
 * Generate overall compatibility reason
 * @param {Number} averageScore - Average match percentage
 * @param {Object} preferencesMatch - Preferences to personality match result
 * @param {Object} personalityMatch - Personality to preferences match result
 * @returns {String} Overall reason
 */
function generateOverallReason(averageScore, preferencesMatch, personalityMatch) {
  let reason = '';

  if (averageScore >= 90) {
    reason = `Exceptional match! This is a highly compatible roommate with ${averageScore}% overall compatibility. `;
  } else if (averageScore >= 80) {
    reason = `Excellent match! Strong compatibility at ${averageScore}% with aligned preferences and lifestyle. `;
  } else if (averageScore >= 70) {
    reason = `Very good match at ${averageScore}%. Most key preferences align well. `;
  } else if (averageScore >= 60) {
    reason = `Good match at ${averageScore}%. Core compatibility exists with some minor differences. `;
  }

  // Add key highlights
  const strongPoints = [];
  if (preferencesMatch.score >= 75) strongPoints.push('their personality fits your preferences excellently');
  if (personalityMatch.score >= 75) strongPoints.push('your personality fits their preferences excellently');

  if (strongPoints.length > 0) {
    reason += `Key strengths: ${strongPoints.join(' and ')}.`;
  }

  return reason;
}

/**
 * Get matching statistics for a user
 * @param {Number} userId - The user ID
 * @param {Number} minMatchPercentage - Minimum match percentage filter
 * @returns {Promise<Object>} Matching statistics
 */
export async function getMatchingStats(userId, minMatchPercentage = 0) {
  try {
    const matches = await findRoommateMatches(userId);

    const goodMatches = matches.filter(m => m.matchPercentage >= minMatchPercentage);

    const stats = {
      totalCandidates: matches.length,
      goodMatches: goodMatches.length,
      averageMatchPercentage:
        matches.length > 0
          ? Math.round(
            matches.reduce((sum, m) => sum + m.matchPercentage, 0) /
            matches.length
          )
          : 0,
      bestMatch: matches.length > 0 ? matches[0] : null,
      worstMatch: matches.length > 0 ? matches[matches.length - 1] : null,
      matchDistribution: {
        excellent: matches.filter(m => m.matchPercentage >= 80).length,
        good: matches.filter(m => m.matchPercentage >= 60 && m.matchPercentage < 80)
          .length,
        fair: matches.filter(m => m.matchPercentage >= 40 && m.matchPercentage < 60)
          .length,
        poor: matches.filter(m => m.matchPercentage < 40).length,
      },
    };

    return stats;
  } catch (error) {
    console.error('Error in getMatchingStats:', error);
    throw error;
  }
}
