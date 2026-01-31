require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const getPublicIP = require("./config/getIP");
const { Gemini } = require("./model/gemini");
const { GroqAI } = require("./model/groq");

const SystemBot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

SystemBot.once("ready", () => {
  console.log(`System Bot đã sẵn sàng! Đăng nhập với tên: ${SystemBot.user.tag}`);
});

const HELP_MESSAGE = `
🤖 **ArchBot - Hướng Dẫn Sử Dụng**

**Các Lệnh Chính:**

📍 **AI Commands:**
\`/gemini <câu hỏi>\` - Chat với Gemini AI
\`/groq <câu hỏi>\` - Chat với Groq AI

💻 **System Commands:**
\`/cmd <command>\` - Chạy lệnh shell trên server
\`@ArchBot ip\` - Lấy địa chỉ IP public

ℹ️ **Khác:**
\`@ArchBot\` - Xem hướng dẫn này

**Ví dụ:**
- \`/gemini Làm thế nào để học lập trình\`
- \`/groq Giải thích về AI là gì\`
- \`@ArchBot ip\`
`;

SystemBot.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // Command: /help
  if (message.content === "/help" || message.content === "/help " || 
      (message.mentions.has(SystemBot.user.id) && message.content.toLowerCase().includes("help"))) {
    try {
      await message.reply(HELP_MESSAGE);
    } catch (err) {
      console.error("Help command error:", err);
    }
    return;
  }

  // Command: /cmd <command>
  if (message.content.startsWith("/cmd ")) {
    const { exec } = require("child_process");
    const cmd = message.content.slice(5).trim();
    try {
      await message.channel.sendTyping();
      exec(cmd, async (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing command "${cmd}":`, error.message);
          return message.reply(`Error: ${error.message}`);
        }
        let response = stdout || stderr || "Command executed (no output)";
        // Remove ANSI color codes
        response = response.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, "");
        // Truncate if too long (Discord limit: 2000 chars)
        const maxLength = 1900;
        if (response.length > maxLength) {
          response = response.substring(0, maxLength) + "\n... (truncated)";
        }
        await message.reply(`\`\`\`\n${response}\n\`\`\``);
      });
    } catch (err) {
      console.error("Command execution error:", err);
      message.reply("Sorry, couldn't process your command.");
    }
    return;
  }

  // Command: /gemini <prompt>
  if (message.content.startsWith("/gemini ")) {
    const prompt = message.content.slice(8).trim();
    if (!prompt) return message.reply("Cú pháp: `/gemini <câu hỏi>`");

    try {
      await message.channel.sendTyping();
      let response = await Gemini(prompt);
      if (!response) return message.reply("AI không phản hồi hoặc có lỗi xảy ra.");

      const maxLength = 1900;
      if (response.length > maxLength) {
        response = response.substring(0, maxLength) + "\n... (truncated)";
      }
      await message.reply(response);
    } catch (err) {
      console.error("Gemini error:", err);
      message.reply("Sorry, couldn't process your request.");
    }
    return;
  }

  // Command: /groq <prompt>
  if (message.content.startsWith("/groq ")) {
    const prompt = message.content.slice(6).trim();
    if (!prompt) return message.reply("Cú pháp: `/groq <câu hỏi>`");

    try {
      await message.channel.sendTyping();
      let response = await GroqAI(prompt);
      if (!response) return message.reply("AI không phản hồi hoặc có lỗi xảy ra.");

      const maxLength = 1900;
      if (response.length > maxLength) {
        response = response.substring(0, maxLength) + "\n... (truncated)";
      }
      await message.reply(response);
    } catch (err) {
      console.error("Groq error:", err);
      message.reply("Sorry, couldn't process your request.");
    }
    return;
  }

  // Commands that require mentioning the bot
  if (!message.mentions.users.has(SystemBot.user.id)) return;

  try {
    await message.channel.sendTyping();
    const content = message.content.toLowerCase();

    if (content.includes("ip")) {
      const ip = await getPublicIP();
      await message.reply(`Current Public IP: ${ip}`);
    } else {
      await message.reply(HELP_MESSAGE);
    }
  } catch (error) {
    console.error("Error in System Bot:", error);
    await message.reply("Sorry, I couldn't process your request.");
  }
});

SystemBot.login(process.env.DISCORD_ARCH_TOKEN).catch((error) =>
  console.error("System Bot login error:", error)
);
