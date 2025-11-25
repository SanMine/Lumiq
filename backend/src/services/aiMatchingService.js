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
            const sanitizedUser1 = this.sanitizeUserData(user1Data, "[YOU]");
            const sanitizedUser2 = this.sanitizeUserData(user2Data, "[THEM]");

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
                bottom_line: analysis.bottom_line,
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
                nickname: personality.nickname || userData.user.name,
                age: personality.age,
                gender: personality.gender,
                nationality: personality.nationality,
                description: personality.description || "No description provided",
                sleepType: personality.sleep_type,
                studyHabits: personality.study_habits,
                cleanliness: personality.cleanliness,
                social: personality.social,
                mbti: personality.MBTI,
                goingOut: personality.going_out,
                smoking: personality.smoking,
                drinking: personality.drinking,
                pets: personality.pets,
                noiseTolerance: personality.noise_tolerance,
                temperature: personality.temperature,
                lifestyle: personality.lifestyle,
            },
            preferences: {
                ageRange: preferences.preferred_age_range,
                gender: preferences.preferred_gender,
                nationality: preferences.preferred_nationality,
                sleepType: preferences.preferred_sleep_type,
                studyHabits: preferences.preferred_study_habits,
                cleanliness: preferences.preferred_cleanliness,
                social: preferences.preferred_social,
                mbti: preferences.preferred_MBTI,
                goingOut: preferences.preferred_going_out,
                smoking: preferences.preferred_smoking,
                drinking: preferences.preferred_drinking,
                pets: preferences.preferred_pets,
                noiseTolerance: preferences.preferred_noise_tolerance,
                temperature: preferences.preferred_temperature,
                additionalPreferences: preferences.additional_preferences,
            },
        };
    }

    /**
     * Build AI prompt for compatibility analysis
     */
    static buildPrompt(user1, user2) {
        return `You are a friendly, honest compatibility analyst for a roommate matching platform.
Your job is to help people make informed decisions about living together.

CRITICAL RULES:
- NEVER use "User A", "User B", "[YOU]", "[THEM]", or any labels in your responses
- Always refer to the first person as "You" or "Your"
- Always refer to the second person as "they", "them", "their", or "your potential roommate"
- Use "You both" when referring to both people together
- Be specific, conversational, and supportive

ANTI-HALLUCINATION RULES (EXTREMELY IMPORTANT):
- ONLY use information explicitly stated in the data below
- DO NOT infer, assume, or make up hobbies, interests, or activities
- DO NOT mention specific activities (gaming, sports, etc.) unless they are EXPLICITLY listed in Lifestyle or Description
- If Lifestyle says "Relaxed", DO NOT assume they like gaming, partying, or any specific activity
- If a field says "Not specified" or is empty, acknowledge it as unknown - DO NOT fill in the blanks
- Base your analysis ONLY on concrete data points like sleep schedules, cleanliness levels, smoking status, etc.

The data below uses [YOU] and [THEM] as internal labels only - DO NOT repeat these labels in your response.


Analyze compatibility between:

${user1.userLabel}:
Bio: "${user1.bio}"
Personality:
- Nickname: ${user1.personality.nickname}
- Age: ${user1.personality.age}
- Gender: ${user1.personality.gender}
- Nationality: ${user1.personality.nationality}
- Description: "${user1.personality.description}"
- Sleep Type: ${user1.personality.sleepType}
- Study Habits: ${user1.personality.studyHabits}
- Cleanliness: ${user1.personality.cleanliness}
- Social Preference: ${user1.personality.social}
- MBTI: ${user1.personality.mbti || "Not specified"}
- Going Out: ${user1.personality.goingOut}
- Smoking: ${user1.personality.smoking ? "Yes" : "No"}
- Drinking: ${user1.personality.drinking}
- Pets: ${user1.personality.pets}
- Noise Tolerance: ${user1.personality.noiseTolerance}
- Temperature Preference: ${user1.personality.temperature}
- Lifestyle: ${user1.personality.lifestyle || "Not specified"}

Preferences:
- Preferred Age Range: ${user1.preferences.ageRange?.min || "Any"}-${user1.preferences.ageRange?.max || "Any"}
- Preferred Gender: ${user1.preferences.gender || "Any"}
- Preferred Nationality: ${user1.preferences.nationality || "Any"}
- Preferred Sleep Type: ${user1.preferences.sleepType || "Any"}
- Preferred Study Habits: ${user1.preferences.studyHabits || "Any"}
- Preferred Cleanliness: ${user1.preferences.cleanliness || "Any"}
- Preferred Social Level: ${user1.preferences.social || "Any"}
- Preferred MBTI: ${user1.preferences.mbti || "Any"}
- Preferred Going Out: ${user1.preferences.goingOut || "Any"}
- Preferred Smoking: ${user1.preferences.smoking ? "Smoker" : "Non-smoker"}
- Preferred Drinking: ${user1.preferences.drinking || "Any"}
- Preferred Pets: ${user1.preferences.pets ? "With pets" : "No pets"}
- Preferred Noise Tolerance: ${user1.preferences.noiseTolerance || "Any"}
- Preferred Temperature: ${user1.preferences.temperature || "Any"}
- Additional Preferences: ${user1.preferences.additionalPreferences || "None"}

${user2.userLabel}:
Bio: "${user2.bio}"
Personality:
- Nickname: ${user2.personality.nickname}
- Age: ${user2.personality.age}
- Gender: ${user2.personality.gender}
- Nationality: ${user2.personality.nationality}
- Description: "${user2.personality.description}"
- Sleep Type: ${user2.personality.sleepType}
- Study Habits: ${user2.personality.studyHabits}
- Cleanliness: ${user2.personality.cleanliness}
- Social Preference: ${user2.personality.social}
- MBTI: ${user2.personality.mbti || "Not specified"}
- Going Out: ${user2.personality.goingOut}
- Smoking: ${user2.personality.smoking ? "Yes" : "No"}
- Drinking: ${user2.personality.drinking}
- Pets: ${user2.personality.pets}
- Noise Tolerance: ${user2.personality.noiseTolerance}
- Temperature Preference: ${user2.personality.temperature}
- Lifestyle: ${user2.personality.lifestyle || "Not specified"}

Preferences:
- Preferred Age Range: ${user2.preferences.ageRange?.min || "Any"}-${user2.preferences.ageRange?.max || "Any"}
- Preferred Gender: ${user2.preferences.gender || "Any"}
- Preferred Nationality: ${user2.preferences.nationality || "Any"}
- Preferred Sleep Type: ${user2.preferences.sleepType || "Any"}
- Preferred Study Habits: ${user2.preferences.studyHabits || "Any"}
- Preferred Cleanliness: ${user2.preferences.cleanliness || "Any"}
- Preferred Social Level: ${user2.preferences.social || "Any"}
- Preferred MBTI: ${user2.preferences.mbti || "Any"}
- Preferred Going Out: ${user2.preferences.goingOut || "Any"}
- Preferred Smoking: ${user2.preferences.smoking ? "Smoker" : "Non-smoker"}
- Preferred Drinking: ${user2.preferences.drinking || "Any"}
- Preferred Pets: ${user2.preferences.pets ? "With pets" : "No pets"}
- Preferred Noise Tolerance: ${user2.preferences.noiseTolerance || "Any"}
- Preferred Temperature: ${user2.preferences.temperature || "Any"}
- Additional Preferences: ${user2.preferences.additionalPreferences || "None"}

Provide a JSON response with:
1. compatibilityScore: Number (0-100) - CALCULATE this score based strictly on the analysis of the data provided. Do not use the example value.
2. bottom_line: String - A friendly, honest one-sentence summary using "You both" or "You"
3. spark: String - The ONE specific thing you both will bond over
4. friction: String - The ONE specific thing you might clash about
5. strengths: Array of {category, explanation} - Top 3-5 reasons you're compatible (use "You both" language)
6. concerns: Array of {category, explanation} - Top 2-3 things to watch out for (use "You" language)
7. summary: String - A warm, direct 2-3 sentence overview using "You both"

Return ONLY valid JSON in this exact format. The values below are for FORMAT REFERENCE ONLY. Do not copy them.
{
  "compatibilityScore": 0,
  "bottom_line": "Example bottom line.",
  "spark": "Example spark.",
  "friction": "Example friction.",
  "strengths": [
    {"category": "Example Category", "explanation": "Example explanation."}
  ],
  "concerns": [
    {"category": "Example Category", "explanation": "Example explanation."}
  ],
  "summary": "Example summary."
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
                            "You are a friendly, honest compatibility analyst for a roommate matching platform. Use 'You both' or 'You' when referring to users. CRITICAL: Only use information explicitly provided in the data - do not infer or make up specific hobbies, activities, or interests. Always respond with valid JSON only. Do not use markdown formatting.",
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
                bottom_line: parsed.bottom_line || "You should have a conversation about expectations before moving in together.",
                spark: parsed.spark || "You both share some common interests.",
                friction: parsed.friction || "You might have different lifestyle preferences.",
                strengths: parsed.strengths || [],
                concerns: parsed.concerns || [],
                summary: parsed.summary || "You both have potential for a good roommate relationship.",
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
            bottom_line: "You should chat before making a final decision - our analysis is temporarily unavailable.",
            spark: "You both have potential to connect once you get to know each other.",
            friction: "We need more data to identify specific areas of concern.",
            strengths: [
                {
                    category: "General Compatibility",
                    explanation:
                        "You both meet the basic criteria for roommate matching. Our AI analysis is temporarily unavailable.",
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
