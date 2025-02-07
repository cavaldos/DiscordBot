require('dotenv').config();
const axios = require('axios');
const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const BOT_ID = process.env.BOT_ID; // Set this to your own bot/user ID

const getMessages = async (limit = 3) => {
    try {
        const response = await axios.get(`https://discord.com/api/v10/channels/${CHANNEL_ID}/messages?limit=${limit}`, {
            headers: {
                'Authorization': `${TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        // Filter out messages from the bot/user itself
        const messages = response.data
            .filter(message => message.author.id !== BOT_ID)
            .map(message => ({
                author: message.author,
                content: message.content
            }));
        return messages;
    } catch (error) {
        console.error('Error fetching messages:', error.message);
        return false;
    }
}

module.exports = getMessages;