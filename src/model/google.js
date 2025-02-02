require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the API with your key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function Gemini(question) {
    try {
        // Use Gemini-Pro model
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        // Create a chat session
        const chat = model.startChat({
            history: [],
            generationConfig: {
                maxOutputTokens: 2000,
                temperature: 0.65,
                topP: 0.8,
                topK: 40,
            },
        });

        // Send a message and get the response
        const result = await chat.sendMessage(question);
        const response = await result.response;
        console.log("Gemini:", response.text());
        return response.text();

    } catch (error) {
        console.error("Error:", error);
    }
}

module.exports = { Gemini };
