require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { Gemini } = require("./model/google");
const { GroqAI } = require("./model/groq");
const splitMessage = require("./config/splitMessage");

// Initialize Gemini Bot
const GeminiBot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Initialize Groq Bot
const GroqBot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Handle message processing for both bots
const handleMessage = async (message, aiModel, botName) => {
  if (message.author.bot) return;

  try {
    console.log(`[${botName}] User message:`, message.content);
    await message.channel.sendTyping();

    const response = await aiModel(message.content);
    if (!response)
      return message.reply("AI không phản hồi hoặc có lỗi xảy ra.");

    const chunks = splitMessage(response);
    for (const chunk of chunks) {
      await message.reply(chunk);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  } catch (error) {
    console.error(`[${botName}] Error generating response:`, error);
    message.reply("Sorry, I couldn't process your request.");
  }
};

// Set up Gemini Bot events
GeminiBot.once("ready", () => {
  console.log(
    `Gemini Bot đã sẵn sàng! Đăng nhập với tên: ${GeminiBot.user.tag}`,
  );
});

GeminiBot.on("messageCreate", async (message) => {
  if (!message.mentions.users.has(GeminiBot.user.id)) return;
  await handleMessage(message, Gemini, "Gemini Bot");
});

// Set up Groq Bot events
GroqBot.once("ready", () => {
  console.log(`Groq Bot đã sẵn sàng! Đăng nhập với tên: ${GroqBot.user.tag}`);
});

GroqBot.on("messageCreate", async (message) => {
  if (!message.mentions.users.has(GroqBot.user.id)) return;
  await handleMessage(message, GroqAI, "Groq Bot");
});

// Login both bots with their respective tokens
GeminiBot.login(process.env.DISCORD_GEMINI_TOKEN);
GroqBot.login(process.env.DISCORD_GROQ_TOKEN);
