const { GoogleGenerativeAI } = require("@google/generative-ai");

let genAI;
let model;

try {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
} catch (error) {
  console.error("Failed to initialize Gemini:", error.message);
}

async function Gemini(prompt) {
  if (!model) return "Gemini chưa được khởi tạo. Kiểm tra API key.";

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API error:", error.message);
    return `Lỗi Gemini: ${error.message}`;
  }
}

module.exports = { Gemini };
