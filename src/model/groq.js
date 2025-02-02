require('dotenv').config();
const Groq = require("groq-sdk");
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

async function GroqAI(question) {
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: question
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.1,
            max_tokens: 1024,
            top_p: 1,
            stop: null,
            stream: false
        });
        return chatCompletion.choices[0].message.content;
    } catch (error) {
        console.error("Error in GroqAI:", error);
        throw error;
    }
}

module.exports = { GroqAI };