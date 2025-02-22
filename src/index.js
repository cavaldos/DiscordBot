require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { Gemini } = require("./model/google");
const { GroqAI } = require("./model/groq");
const splitMessage = require("./config/splitMessage");
const getPublicIP = require("./config/getIP");
const { runCommand, runCommandPromise } = require("./config/runcommand");
// Initialize bots with common intents
const commonIntents = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
];

const createBot = () => new Client({ intents: commonIntents });

const GeminiBot = createBot();
const GroqBot = createBot();
const SystemBot = createBot();

// Set up System Bot events
SystemBot.once("ready", () => {
  console.log(`System Bot đã sẵn sàng! Đăng nhập với tên: ${SystemBot.user.tag}`);
});

SystemBot.on("messageCreate", async (message) => {
  if (!message.mentions.users.has(SystemBot.user.id)) return;
  try {
    await message.channel.sendTyping();
    const content = message.content.toLowerCase();
    if (content.includes('ip')) {
      const ip = await getPublicIP();
      await message.reply(`Current Public IP: ${ip}`);
    } else if (content.includes('deploy')) {
      const output = await runCommandPromise();
      await message.reply(`Deploy Results:\n${output}`);
    } else {
      await message.reply('Xin lỗi, tôi chỉ hỗ trợ lệnh: ip và deploy.');
    }
  } catch (error) {
    console.error('Error in System Bot:', error);
    await message.reply("Sorry, I couldn't process your request.");
  }
});

// Handle message processing for AI bots
const handleMessage = async (message, aiModel, botName) => {
  if (message.author.bot) return;

  try {
    console.log(`[${botName}] User message:`, message.content);
    await message.channel.sendTyping();

    const response = await aiModel(message.content);
    if (!response) {
      return message.reply("AI không phản hồi hoặc có lỗi xảy ra.");
    }

    const chunks = splitMessage(response);
    for (const chunk of chunks) {
      await message.reply(chunk);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  } catch (error) {
    console.error(`[${botName}] Error generating response:`, error);
    await message.reply("Sorry, I couldn't process your request.");
  }
};

// Set up bot event handlers
const setupBot = (bot, aiModel, botName) => {
  bot.once("ready", () => {
    console.log(`${botName} đã sẵn sàng! Đăng nhập với tên: ${bot.user.tag}`);
  });

  bot.on("messageCreate", async (message) => {
    if (!message.mentions.users.has(bot.user.id)) return;
    await handleMessage(message, aiModel, botName);
  });
};

// Configure each bot
setupBot(GeminiBot, Gemini, "Gemini Bot");
setupBot(GroqBot, GroqAI, "Groq Bot");

// Login all bots with error handling
GeminiBot.login(process.env.DISCORD_GEMINI_TOKEN)
  .catch(error => console.error("Gemini Bot login error:", error));
GroqBot.login(process.env.DISCORD_GROQ_TOKEN)
  .catch(error => console.error("Groq Bot login error:", error));
SystemBot.login(process.env.DISCORD_ARCH_TOKEN)
  .catch(error => console.error("System Bot login error:", error));
