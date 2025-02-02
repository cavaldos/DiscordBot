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
            // Reset chat history if more than 3 minutes passed
            chatHistory = [];
        }
        lastMessageTime = currentTime;

        // Use Gemini-Pro model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Format chat history for Gemini API
        const formattedHistory = chatHistory.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.parts }]
        }));

        // Create a chat session with history
        const chat = model.startChat({
            history: formattedHistory,
            generationConfig: {
                maxOutputTokens: 2000,
                temperature: 0.65,
                topP: 0.8,
                topK: 40,
            },
        });

        // Send message and get response
        const result = await chat.sendMessage([{ text: question }]);
        const response = await result.response;
        const responseText = response.text();

        // Update chat history
        chatHistory.push({
            role: "user",
            parts: question
        });
        chatHistory.push({
            role: "model",
            parts: responseText
        });

        console.log("Gemini:", responseText);
        return responseText;

    } catch (error) {
        console.error("Error:", error);
    }
}

module.exports = { Gemini };
