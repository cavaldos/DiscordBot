require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { Gemini } = require("./model/google");
const { GroqAI } = require("./model/groq");

// Khởi tạo 2 bot Discord
const bot1 = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const bot2 = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Hàm xử lý tin nhắn chung
async function handleMessage(message, aiModel) {
    if (message.author.bot) return;

    try {
        console.log(`[${aiModel.name} Bot] User message:`, message.content);

        // Gửi typing indicator
        await message.channel.sendTyping();

        // Chọn AI Model phù hợp
        const response = await aiModel.function(message.content);
        if (!response) return message.reply("AI không phản hồi hoặc có lỗi xảy ra.");

        const maxLength = 2000;

        // Chia nhỏ tin nhắn dài
        const splitMessage = (text) => {
            const chunks = [];
            const codeBlockRegex = /```[\s\S]*?```/g;
            let lastIndex = 0;
            let match;

            while ((match = codeBlockRegex.exec(text)) !== null) {
                const codeBlock = match[0];
                const textBefore = text.slice(lastIndex, match.index);

                if (textBefore.length > 0) {
                    const textChunks = textBefore.match(/[\s\S]{1,1994}/g) || [];
                    textChunks.forEach(chunk => chunks.push(chunk));
                }

                if (codeBlock.length > maxLength) {
                    const codeContent = codeBlock.slice(3, -3);
                    const codeChunks = codeContent.match(/[\s\S]{1,1994}/g) || [];
                    codeChunks.forEach((chunk, index) => {
                        chunks.push(`\`\`\`${index === 0 ? 'cpp' : ''}\n${chunk}\n\`\`\``);
                    });
                } else {
                    chunks.push(codeBlock);
                }

                lastIndex = codeBlockRegex.lastIndex;
            }

            const remainingText = text.slice(lastIndex);
            if (remainingText.length > 0) {
                const remainingChunks = remainingText.match(/[\s\S]{1,2000}/g) || [];
                remainingChunks.forEach(chunk => chunks.push(chunk));
            }

            return chunks;
        };

        const chunks = splitMessage(response);

        for (const chunk of chunks) {
            await message.reply(chunk);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

    } catch (error) {
        console.error(`[${aiModel.name} Bot] Error generating response:`, error);
        message.reply("Xin lỗi, tôi không thể xử lý yêu cầu của bạn.");
    }
}

// Gắn sự kiện xử lý tin nhắn cho từng bot
bot1.on('messageCreate', async message => {
    await handleMessage(message, { name: "Gemini", function: Gemini });
});

bot2.on('messageCreate', async message => {
    await handleMessage(message, { name: "Groq", function: GroqAI });
});

// Đăng nhập hai bot
bot1.login(process.env.DISCORD_TOKEN_1);
bot2.login(process.env.DISCORD_TOKEN_2);

bot1.once('ready', () => {
    console.log(`Bot 1 (Gemini) đã sẵn sàng! Đăng nhập với tên: ${bot1.user.tag}`);
});

bot2.once('ready', () => {
    console.log(`Bot 2 (Groq) đã sẵn sàng! Đăng nhập với tên: ${bot2.user.tag}`);
});
