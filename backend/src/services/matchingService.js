/**
 * User Matching Service using Groq AI
 * Finds compatible roommates based on personality and preferences
 */

import { Groq } from 'groq-sdk';
import { User } from '../models/User.js';
import { User_personality } from '../models/User_personality.js';
import { Preferred_roommate } from '../models/Preferred_roommate.js';

// Initialize Groq client lazily
let groqClient = null;

function getGroqClient() {
  if (!groqClient) {
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  return groqClient;
}

/**
 * Find compatible roommates for a user using Groq AI
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

    // Get all other users with their personalities
    const allUsers = await User.find({ _id: { $ne: userId } });
    
    // Get personalities for all other users
    const personalities = await User_personality.find({
      userId: { $in: allUsers.map(u => u._id) },
    });

    // Create a map for quick lookup
    const personalityMap = {};
    personalities.forEach(p => {
      personalityMap[p.userId] = p;
    });

    // Filter users who have personality profiles
    const usersWithProfiles = allUsers.filter(u => personalityMap[u._id]);

    if (usersWithProfiles.length === 0) {
      return [];
    }

    // Prepare data for Groq AI analysis
    const targetUserData = {
      name: targetUser.name,
      personality: targetPersonality,
      preferences: targetPreferences,
    };

    const candidatesData = usersWithProfiles.map(user => ({
      id: user._id,
      name: user.name,
      personality: personalityMap[user._id],
    }));

    // Call Groq AI to analyze compatibility
    const matches = await analyzeCompatibilityWithGroq(
      targetUserData,
      candidatesData,
      usersWithProfiles.length
    );

    // Sort by match percentage (highest first)
    matches.sort((a, b) => b.matchPercentage - a.matchPercentage);

    return matches;
  } catch (error) {
    console.error('Error in findRoommateMatches:', error);
    throw error;
  }
}

/**
 * Analyze compatibility using Groq AI
 * @param {Object} targetUser - Target user's profile
 * @param {Array} candidates - Array of candidate users
 * @param {Number} totalCandidates - Total number of candidates
 * @returns {Promise<Array>} Array of matched users with scores
 */
async function analyzeCompatibilityWithGroq(targetUser, candidates, totalCandidates) {
  // Create a detailed prompt for the AI
  const prompt = `You are a roommate matching expert. Analyze compatibility between a target user and candidate roommates based on personality traits, preferences, and lifestyle.

TARGET USER:
Name: ${targetUser.name}
Personality Profile:
- Age: ${targetUser.personality.age}
- Gender: ${targetUser.personality.gender}
- Nationality: ${targetUser.personality.nationality}
- Sleep Type: ${targetUser.personality.sleep_type}
- Study Habits: ${targetUser.personality.study_habits}
- Cleanliness: ${targetUser.personality.cleanliness}
- Social: ${targetUser.personality.social}
- MBTI: ${targetUser.personality.MBTI}
- Going Out: ${targetUser.personality.going_out}
- Smoking: ${targetUser.personality.smoking}
- Drinking: ${targetUser.personality.drinking}
- Pets: ${targetUser.personality.pets}
- Noise Tolerance: ${targetUser.personality.noise_tolerance}
- Temperature Preference: ${targetUser.personality.temperature}
- Lifestyle: ${targetUser.personality.lifestyle.join(', ')}

Roommate Preferences:
- Preferred Age Range: ${targetUser.preferences.preferred_age_range.min}-${targetUser.preferences.preferred_age_range.max}
- Preferred Gender: ${targetUser.preferences.preferred_gender}
- Preferred Sleep Type: ${targetUser.preferences.preferred_sleep_type}
- Preferred Smoking: ${targetUser.preferences.preferred_smoking}
- Preferred Pets: ${targetUser.preferences.preferred_pets}
- Preferred Noise Tolerance: ${targetUser.preferences.preferred_noise_tolerance}
- Preferred Cleanliness: ${targetUser.preferences.preferred_cleanliness}
- Preferred MBTI: ${targetUser.preferences.preferred_MBTI}
- Preferred Temperature: ${targetUser.preferences.preferred_temperature}
- Additional Preferences: ${targetUser.preferences.additional_preferences}

CANDIDATE ROOMMATES:
${candidates
  .map(
    (cand, idx) => `
Candidate ${idx + 1} (ID: ${cand.id}):
Name: ${cand.name}
- Age: ${cand.personality.age}
- Gender: ${cand.personality.gender}
- Nationality: ${cand.personality.nationality}
- Sleep Type: ${cand.personality.sleep_type}
- Study Habits: ${cand.personality.study_habits}
- Cleanliness: ${cand.personality.cleanliness}
- Social: ${cand.personality.social}
- MBTI: ${cand.personality.MBTI}
- Going Out: ${cand.personality.going_out}
- Smoking: ${cand.personality.smoking}
- Drinking: ${cand.personality.drinking}
- Pets: ${cand.personality.pets}
- Noise Tolerance: ${cand.personality.noise_tolerance}
- Temperature Preference: ${cand.personality.temperature}
- Lifestyle: ${cand.personality.lifestyle.join(', ')}
`
  )
  .join('\n')}

TASK:
Analyze each candidate and provide a compatibility match score for each (0-100%). Consider:
1. Personality compatibility (MBTI, lifestyle, social compatibility)
2. Lifestyle alignment (sleep schedule, noise tolerance, cleanliness, going out habits)
3. How well each candidate matches the target user's specific preferences
4. Overall living compatibility

Respond ONLY with a JSON array in this exact format. No extra text, markdown, or explanations:
[
  {
    "candidateId": <number>,
    "candidateName": "<string>",
    "matchPercentage": <number between 0-100>,
    "compatibility": {
      "personalityMatch": "<brief reason>",
      "lifestyleMatch": "<brief reason>",
      "preferenceMatch": "<brief reason>",
      "overallReason": "<brief overall reason>"
    }
  },
  ...
]`;

  try {
    // Call Groq API with streaming
    const groq = getGroqClient();
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.6,
      max_completion_tokens: 2000,
      top_p: 1,
      stream: false, // Set to false to get complete response at once
      stop: null,
    });

    // Extract the response
    const responseText = chatCompletion.choices[0]?.message?.content || '';

    // Parse JSON response from AI
    let matches = [];
    try {
      // Try to extract JSON from the response (in case there's extra text)
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        matches = JSON.parse(jsonMatch[0]);
      } else {
        matches = JSON.parse(responseText);
      }
    } catch (parseError) {
      console.error('Failed to parse Groq response as JSON:', responseText);
      throw new Error('Failed to parse AI response');
    }

    return matches;
  } catch (error) {
    console.error('Error calling Groq API:', error);
    throw error;
  }
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
