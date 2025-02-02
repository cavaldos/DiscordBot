require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { Gemini } = require("./model/google");
const { GroqAI } = require("./model/groq");
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`Bot đã sẵn sàng! Đăng nhập với tên: ${client.user.tag}`);
});
client.on('messageCreate', async message => {
    if (message.author.bot) return;

    try {
        // Start typing indicator
        await message.channel.sendTyping();

        const response = await Gemini(message.content);
        const maxLength = 2000;

        const splitMessage = (text) => {
            const chunks = [];
            const codeBlockRegex = /```[\s\S]*?```/g;
            let lastIndex = 0;
            let match;

            // Xử lý từng code block và text thường
            while ((match = codeBlockRegex.exec(text)) !== null) {
                const codeBlock = match[0];
                const textBefore = text.slice(lastIndex, match.index);

                // Chia text thường thành chunks
                if (textBefore.length > 0) {
                    const textChunks = textBefore.match(/[\s\S]{1,1994}/g) || [];
                    textChunks.forEach(chunk => chunks.push(chunk));
                }

                // Chia code block nếu quá dài
                if (codeBlock.length > maxLength) {
                    const codeContent = codeBlock.slice(3, -3); // Bỏ dấu ```
                    const codeChunks = codeContent.match(/[\s\S]{1,1994}/g) || [];
                    codeChunks.forEach((chunk, index) => {
                        chunks.push(`\`\`\`${index === 0 ? 'cpp' : ''}\n${chunk}\n\`\`\``);
                    });
                } else {
                    chunks.push(codeBlock);
                }

                lastIndex = codeBlockRegex.lastIndex;
            }

            // Xử lý phần còn lại sau code block cuối
            const remainingText = text.slice(lastIndex);
            if (remainingText.length > 0) {
                const remainingChunks = remainingText.match(/[\s\S]{1,2000}/g) || [];
                remainingChunks.forEach(chunk => chunks.push(chunk));
            }

            return chunks;
        };

        const chunks = splitMessage(response);

        // Gửi từng chunk với định dạng đúng
        for (const chunk of chunks) {
            await message.reply(chunk);
            await new Promise(resolve => setTimeout(resolve, 1000)); 
        }

    } catch (error) {
        console.error("Error generating response:", error);
        message.reply("Sorry, I couldn't process your request.");
    }
});

client.login(process.env.DISCORD_TOKEN);
