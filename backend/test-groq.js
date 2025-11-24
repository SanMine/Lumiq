import Groq from "groq-sdk";
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function testAI() {
    try {
        console.log("API Key:", process.env.GROQ_API_KEY ? "EXISTS" : "MISSING");

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a friendly compatibility analyst. Always respond with valid JSON only."
                },
                {
                    role: "user",
                    content: "Return this JSON: {\"test\": \"success\", \"message\": \"hello\"}"
                }
            ],
            model: "llama-3.1-8b-instant",
            temperature: 0.7,
            max_completion_tokens: 100,
            response_format: { type: "json_object" }
        });

        console.log("SUCCESS:", chatCompletion.choices[0]?.message?.content);
    } catch (error) {
        console.error("ERROR:", error.message);
        console.error("Details:", error);
    }
}

testAI();
