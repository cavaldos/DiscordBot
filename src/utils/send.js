require('dotenv').config();
const axios = require('axios');


const TOKEN = process.env.DISCORD_TOKEN;      
const CHANNEL_ID = process.env.CHANNEL_ID; 

async function sendMessage(content) {
  const response = await axios.
  post(`https://discord.com/api/v9/channels/${CHANNEL_ID}/messages`, { content }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': TOKEN
    }
  });
  const data = response.data;
  console.log(data);
}



module.exports = sendMessage;