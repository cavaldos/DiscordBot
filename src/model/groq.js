require('dotenv').config();
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

        // Nếu đã có cuộc trò chuyện và khoảng thời gian kể từ tin nhắn cuối cùng vượt quá 5 phút, reset context
        if (conversation.length && now - lastInteraction > 200000) {
            conversation = [];
        }

        // Thêm câu hỏi mới vào context
        conversation.push({
            role: "user",
            content: question
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

        // Lấy kết quả phản hồi và thêm vào context
        const answer = chatCompletion.choices[0].message.content;
        conversation.push({
            role: "assistant",
            content: answer
        });

        // Cập nhật thời điểm tương tác cuối cùng sau khi nhận câu trả lời
        lastInteraction = Date.now();

        return answer;
    } catch (error) {
        console.error("Error in GroqAI:", error);
        throw error;
    }
}

module.exports = { GroqAI };