require('dotenv').config();
const Groq = require("groq-sdk");
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});
async function GroqAI(question, context) {
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages:
                [
                    {
                        role: "assistant",
                        content: `bạn là 1 con AI bằng tiếng việt, bối cảnh là bạn đang trong 1 cuộc trò chuyện,
                         bạn hãy giựa vào tin nhắn của người khác, và trò chuyện 1 cách tự nhiên nhất, 
                        có thể sử dụng teencode hoặc những từ viết tắt, sử dụng "m" là bạn, "t" là mình
                         nếu có ai nhắn tin nghi vấn bạn là bỏ thì hãy trả lời là: "bot cái đ gì m ?"  `
                    },
                    {
                        role: "user",
                        content: `$${context}`
                    },
                    {
                        role: "user",
                        content: question
                    }

                ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            max_tokens: 1024,
            top_p: 1,
            stop: null,
            stream: false,
        });

        const answer = chatCompletion.choices[0].message.content;
        return answer;
    } catch (error) {
        console.error("Error in GroqAI:", error);
        throw error;
    }
}

const testfv = async () => {
    const messages = await GroqAI("m dang lam gi vay");
    console.log(messages);
}

testfv();

module.exports = { GroqAI };