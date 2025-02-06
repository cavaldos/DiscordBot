require("dotenv").config();
const Groq = require("groq-sdk");
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Lưu trữ context của cuộc trò chuyện
let conversation = [];
let lastInteraction = Date.now();

async function GroqAI(question) {
  try {
    const now = Date.now();
    if (conversation.length && now - lastInteraction > 200000) {
      conversation = [];
    }
    conversation.push({
      role: "user",
      content: question,
    });
    const chatCompletion = await groq.chat.completions.create({
      messages: conversation,
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      max_tokens: 1024,
      top_p: 1,
      stop: null,
      stream: false,
    });

    const answer = chatCompletion.choices[0].message.content;
    conversation.push({
      role: "assistant",
      content: answer,
    });

    lastInteraction = Date.now();

    return answer;
  } catch (error) {
    console.error("Error in GroqAI:", error);
    throw error;
  }
}

module.exports = { GroqAI };
