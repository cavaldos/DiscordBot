const Groq = require("groq-sdk");

let groq;

try {
  groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
} catch (error) {
  console.error("Failed to initialize Groq:", error.message);
}

async function GroqAI(prompt) {
  if (!groq) return "Groq chưa được khởi tạo. Kiểm tra API key.";

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
    });
    return chatCompletion.choices[0]?.message?.content || "Không có phản hồi.";
  } catch (error) {
    console.error("Groq API error:", error.message);
    return `Lỗi Groq: ${error.message}`;
  }
}

module.exports = { GroqAI };
