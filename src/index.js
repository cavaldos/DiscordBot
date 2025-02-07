const getMessages = require('./utils/getMessage');
const sendMessage = require('./utils/send');
const { GroqAI } = require('./model/groq');

async function runBot() {
    try {
        const messages = await getMessages(3);
        if (!messages || messages.length === 0) {
            console.error('Failed to fetch messages.');
            return;
        }

        // Build a context from all messages (oldest at the bottom)
        // Assuming messages are ordered from newest to oldest, we reverse them.
        const context = messages.slice().reverse().map(msg => `${msg.author.global_name || msg.author.username}: ${msg.content}`).join('\n');

        // Use the latest message as the question
        const latestMessage = messages[0];

        // Generate AI response using context and the latest message
        const aiResponse = await GroqAI(latestMessage.content, context);
        if (aiResponse) {
            await sendMessage(aiResponse);
        }
    } catch (error) {
        console.error('Error in runBot:', error);
    }
}

// Run the bot every minute (here using 1 second for testing, adjust as needed)
setInterval(runBot, 6000);
