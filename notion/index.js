require('dotenv').config();
const { Client } = require('discord.js-selfbot-v13');
const client = new Client();
const words = require('./data.json');

const wordsWithExample = words.filter(
  (w) =>
    (w.spacedTime === 'L1' || w.spacedTime === 'L2') &&
    w.example &&
    w.example.trim() !== ''
);

/**
 * Chuyển chữ thường sang Unicode bold math (𝐚→𝐳)
 */
function toBoldChar(c) {
  const code = c.charCodeAt(0);
  // a-z → U+1D41A..U+1D433
  if (code >= 0x61 && code <= 0x7a) return String.fromCodePoint(0x1d41a + (code - 0x61));
  // A-Z → U+1D400..U+1D419
  if (code >= 0x41 && code <= 0x5a) return String.fromCodePoint(0x1d400 + (code - 0x41));
  return c;
}

function toBoldWord(word) {
  return [...word].map(toBoldChar).join('');
}

/**
 * Bôi đậm từ vựng trong câu ví dụ bằng Unicode bold math
 * (Discord RPC không hỗ trợ markdown, nên dùng Unicode thay thế)
 */
function boldWord(text, word) {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(`(${escaped})`, 'gi'), (match) => toBoldWord(match));
}

client.on('ready', async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  console.log(`📚 Loaded ${wordsWithExample.length} words with examples`);

  const presenceStartedAt = Date.now() - 36 * 60 * 60 * 1000;

  const updatePresence = () => {
    const randomWord =
      wordsWithExample[Math.floor(Math.random() * wordsWithExample.length)];

    client.user.setPresence({
      activities: [
        {
          application_id: '947582103095234562',
          name: 'Workspace: English',
          type: 'PLAYING',
          details: `📖 ${randomWord.word} - ${randomWord.pronounce} - ${randomWord.type}`,
          state: boldWord(randomWord.example, randomWord.word),
          timestamps: {
            start: presenceStartedAt
          },
          assets: {
            large_image:
              'https://cdn.discordapp.com/app-assets/1514222081640763442/1514502861382488199',
            large_text: 'Notion',
            // small_image:
            //   'https://cdn.discordapp.com/app-assets/1514222081640763442/1514513380935995412',
            small_text: 'Editing',
          },
        },
      ],
      status: 'online',
    });
  };

  updatePresence();
  setInterval(updatePresence, 10000);
});

client.login(process.env.DISCORD_TOKEN);
