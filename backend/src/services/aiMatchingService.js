import Groq from "groq-sdk";
import crypto from "crypto";
import { AiMatchResult } from "../models/AiMatchResult.js";
import { User } from "../models/User.js";
import { User_personality } from "../models/User_personality.js";
import { Preferred_roommate } from "../models/Preferred_roommate.js";

let groqInstance = null;

function getGroqClient() {
    if (!groqInstance) {
        if (!process.env.GROQ_API_KEY) {
            console.warn("GROQ_API_KEY is missing. AI features will be disabled or fallback.");
        }
        groqInstance = new Groq({
            apiKey: process.env.GROQ_API_KEY || "dummy_key_to_prevent_crash",
        });
    }
    return groqInstance;
}

export class AiMatchingService {
    /**
     * Generate a unique hash for a user pair (idempotent)
     */
    static generatePairHash(userId1, userId2) {
        const sorted = [userId1, userId2].sort((a, b) => a - b);
        return crypto
            .createHash("sha256")
            .update(`${sorted[0]}-${sorted[1]}`)
            .digest("hex");
    }

    /**
     * Get or create AI compatibility analysis between two users
     */
    static async analyzeCompatibility(userId1, userId2) {
        try {
            // Generate pair hash for caching
            const pairHash = this.generatePairHash(userId1, userId2);

            // Check cache first
            const cached = await AiMatchResult.findOne({ pairHash });
            if (cached) {
                console.log(`Cache hit for pair ${userId1}-${userId2}`);
                return {
                    ...cached.toObject(),
                    cached: true,
                    generatedAt: cached.createdAt,
                };
            }

            console.log(`Cache miss for pair ${userId1}-${userId2}, calling AI...`);

            // Fetch user data
            const [user1Data, user2Data] = await Promise.all([
                this.fetchUserData(userId1),
                this.fetchUserData(userId2),
            ]);

            // Sanitize PII
            const sanitizedUser1 = this.sanitizeUserData(user1Data, "User A");
            const sanitizedUser2 = this.sanitizeUserData(user2Data, "User B");

            // Build prompt
            const prompt = this.buildPrompt(sanitizedUser1, sanitizedUser2);

            // Call Groq API
            const aiResponse = await this.callGroqAPI(prompt);

            // Parse response
            const analysis = this.parseAiResponse(aiResponse);

            // Save to cache
            const savedResult = await AiMatchResult.create({
                pairHash,
                user1Id: userId1,
                user2Id: userId2,
                compatibilityScore: analysis.compatibilityScore,
                verdict: analysis.verdict,
                spark: analysis.spark,
                friction: analysis.friction,
                strengths: analysis.strengths,
                concerns: analysis.concerns,
                summary: analysis.summary,
            });

            return {
                ...savedResult.toObject(),
                cached: false,
                generatedAt: savedResult.createdAt,
            };
        } catch (error) {
            console.error("AI Analysis Error:", error);
            return this.getFallbackResult();
        }
    }

    /**
     * Fetch all user data (personality + preferences)
     */
    static async fetchUserData(userId) {
        const [user, personality, preferences] = await Promise.all([
            User.findById(userId),
            User_personality.findOne({ userId }),
            Preferred_roommate.findOne({ userId }),
        ]);

        if (!user || !personality || !preferences) {
            throw new Error(`Incomplete data for user ${userId}`);
        }

        return { user, personality, preferences };
    }

    /**
     * Sanitize user data - remove PII
     */
    static sanitizeUserData(userData, label) {
        const { personality, preferences } = userData;

        return {
            userLabel: label,
            bio: userData.user.bio || "No bio provided",
            personality: {
                age: personality.age,
                gender: personality.gender,
                sleepType: personality.sleep_type,
                mbti: personality.MBTI,
                cleanliness: personality.cleanliness,
                smoking: personality.smoking,
                pets: personality.pets,
                noiseTolerance: personality.noise_tolerance,
                temperature: personality.temperature,
                nationality: personality.nationality,
                hobbies: personality.hobbies,
                lifestyle: personality.lifestyle,
            },
            preferences: {
                ageRange: preferences.preferred_age_range,
                gender: preferences.preferred_gender,
                sleepType: preferences.preferred_sleep_type,
                mbti: preferences.preferred_MBTI,
                cleanliness: preferences.preferred_cleanliness,
                smoking: preferences.preferred_smoking,
                pets: preferences.preferred_pets,
                noiseTolerance: preferences.preferred_noise_tolerance,
                temperature: preferences.preferred_temperature,
                nationality: preferences.preferred_nationality,
            },
        };
    }

    /**
     * Build AI prompt for compatibility analysis
     */
    static buildPrompt(user1, user2) {
        return `You are a brutal, honest Risk Analyst for a roommate matching agency. Your job is to prevent disasters, not to be polite.
Avoid corporate jargon like "necessitate", "optimal", "synergy", or "align". Use simple, direct English.
Identify the specific "Spark" (why they will bond) and the specific "Friction" (why they will fight).
Look for nuances in their Bios that might override the raw data.

Analyze compatibility between:

${user1.userLabel}:
Bio: "${user1.bio}"
Personality:
- Age: ${user1.personality.age}
- Gender: ${user1.personality.gender}
- Sleep Type: ${user1.personality.sleepType}
- MBTI: ${user1.personality.mbti}
- Cleanliness: ${user1.personality.cleanliness}
- Smoking: ${user1.personality.smoking ? "Yes" : "No"}
- Pets: ${user1.personality.pets}
- Noise Tolerance: ${user1.personality.noiseTolerance}
- Temperature Preference: ${user1.personality.temperature}
- Nationality: ${user1.personality.nationality}
- Hobbies: ${user1.personality.hobbies || "Not specified"}
- Lifestyle: ${user1.personality.lifestyle || "Not specified"}

Preferences:
- Preferred Age Range: ${user1.preferences.ageRange?.min || "Any"}-${user1.preferences.ageRange?.max || "Any"}
- Preferred Gender: ${user1.preferences.gender || "Any"}
- Preferred Sleep Type: ${user1.preferences.sleepType || "Any"}
- Preferred MBTI: ${user1.preferences.mbti || "Any"}
- Preferred Cleanliness: ${user1.preferences.cleanliness}
- Preferred Smoking: ${user1.preferences.smoking ? "Smoker" : "Non-smoker"}
- Preferred Pets: ${user1.preferences.pets ? "With pets" : "No pets"}
- Preferred Noise Tolerance: ${user1.preferences.noiseTolerance || "Any"}
- Preferred Temperature: ${user1.preferences.temperature || "Any"}

${user2.userLabel}:
Bio: "${user2.bio}"
Personality:
- Age: ${user2.personality.age}
- Gender: ${user2.personality.gender}
- Sleep Type: ${user2.personality.sleepType}
- MBTI: ${user2.personality.mbti}
- Cleanliness: ${user2.personality.cleanliness}
- Smoking: ${user2.personality.smoking ? "Yes" : "No"}
- Pets: ${user2.personality.pets}
- Noise Tolerance: ${user2.personality.noiseTolerance}
- Temperature Preference: ${user2.personality.temperature}
- Nationality: ${user2.personality.nationality}
- Hobbies: ${user2.personality.hobbies || "Not specified"}
- Lifestyle: ${user2.personality.lifestyle || "Not specified"}

Preferences:
- Preferred Age Range: ${user2.preferences.ageRange?.min || "Any"}-${user2.preferences.ageRange?.max || "Any"}
- Preferred Gender: ${user2.preferences.gender || "Any"}
- Preferred Sleep Type: ${user2.preferences.sleepType || "Any"}
- Preferred MBTI: ${user2.preferences.mbti || "Any"}
- Preferred Cleanliness: ${user2.preferences.cleanliness}
- Preferred Smoking: ${user2.preferences.smoking ? "Smoker" : "Non-smoker"}
- Preferred Pets: ${user2.preferences.pets ? "With pets" : "No pets"}
- Preferred Noise Tolerance: ${user2.preferences.noiseTolerance || "Any"}
- Preferred Temperature: ${user2.preferences.temperature || "Any"}

Provide a JSON response with:
1. compatibilityScore: Number (0-100)
2. verdict: String - A blunt, one-sentence final judgment.
3. spark: String - The ONE specific thing they will bond over.
4. friction: String - The ONE specific thing they will fight about.
5. strengths: Array of {category, explanation} - Top 3 compatibility strengths.
6. concerns: Array of {category, explanation} - Top 2 potential concerns.
7. summary: String - A direct, no-nonsense summary (2-3 sentences).

Return ONLY valid JSON in this exact format:
{
  "compatibilityScore": 85,
  "verdict": "Good match, as long as User B buys earplugs.",
  "spark": "Both love late-night gaming sessions.",
  "friction": "User A is messy, and User B is a neat freak.",
  "strengths": [
    {"category": "Sleep Schedule", "explanation": "Both are night owls."}
  ],
  "concerns": [
    {"category": "Cleanliness", "explanation": "User A needs to keep the door closed."}
  ],
  "summary": "They will get along great until the dishes pile up."
}`;
    }

    /**
     * Call Groq API
     */
    static async callGroqAPI(prompt) {
        try {
            const chatCompletion = await getGroqClient().chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content:
                            "You are a brutal, honest Risk Analyst. Always respond with valid JSON only. Do not use markdown formatting.",
                    },
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                model: "llama-3.1-8b-instant",
                temperature: 0.7, // Lower for consistency
                max_completion_tokens: 1024,
                top_p: 1,
                response_format: { type: "json_object" }, // Enforce JSON
            });

            return chatCompletion.choices[0]?.message?.content || "{}";
        } catch (error) {
            console.error("Groq API Error:", error);
            throw error;
        }
    }

    /**
     * Parse AI response
     */
    static parseAiResponse(response) {
        try {
            const parsed = JSON.parse(response);

            return {
                compatibilityScore: parsed.compatibilityScore || 75,
                verdict: parsed.verdict || "Decent match, but proceed with caution.",
                spark: parsed.spark || "Shared interests.",
                friction: parsed.friction || "Potential lifestyle clashes.",
                strengths: parsed.strengths || [],
                concerns: parsed.concerns || [],
                summary: parsed.summary || "Analysis completed.",
            };
        } catch (error) {
            console.error("JSON Parse Error:", error);
            throw error;
        }
    }

    /**
     * Fallback result when AI fails
     */
    static getFallbackResult() {
        return {
            compatibilityScore: 75,
            verdict: "Data unavailable, proceed with caution.",
            spark: "Unknown.",
            friction: "Unknown.",
            strengths: [
                {
                    category: "General Compatibility",
                    explanation:
                        "AI analysis temporarily unavailable. Showing estimated compatibility based on basic matching.",
                },
            ],
            concerns: [
                {
                    category: "Limited Analysis",
                    explanation:
                        "Detailed AI analysis is currently unavailable. Please try again later for comprehensive insights.",
                },
            ],
            summary:
                "AI analysis service temporarily unavailable. This is a fallback compatibility estimate. Please refresh to try again.",
            cached: false,
            error: "AI_SERVICE_ERROR",
            generatedAt: new Date(),
        };
    }
}
