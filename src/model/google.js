require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the API with your key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Store chat history with timestamps
let chatHistory = [];
let lastMessageTime = null;

async function Gemini(question) {
    try {
        // Check if 3 minutes have passed since last message
        const currentTime = Date.now();
        if (lastMessageTime && (currentTime - lastMessageTime) > 180000) {
            chatHistory = [];
        }
        lastMessageTime = currentTime;

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const formattedHistory = chatHistory.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.parts }]
        }));

        const chat = model.startChat({
            history: formattedHistory,
            generationConfig: {
                maxOutputTokens: 2000,
                temperature: 0.65,
                topP: 0.8,
                topK: 40,
            },
        });

        const result = await chat.sendMessage([{ text: question }]);
        const response = await result.response;
        const responseText = response.text();

        chatHistory.push({
            role: "user",
            parts: question
        });
        chatHistory.push({
            role: "model",
            parts: responseText
        });

        return responseText;

    } catch (error) {
        console.error("Error:", error);
    }
}

module.exports = { Gemini };
