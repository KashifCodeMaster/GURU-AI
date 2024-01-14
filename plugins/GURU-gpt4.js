import fetch from 'node-fetch';
import { delay } from '@whiskeysockets/baileys';

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  try {
    if (!text) {
      m.reply(`Well, I can't read minds yet. How about sharing your thoughts with me?`);
      return;
    }

    m.react('🤖');
    const prompt = encodeURIComponent(text);
    let apiUrl = `https://ultimetron.guruapi.tech/gpt4?prompt=${prompt}`;
    const result = await fetch(apiUrl);

    if (!result.ok) {
      throw new Error(`Received an error response from the server: ${result.status} - ${result.statusText}`);
    }

    const response = await result.json();
    const generatedText = response.result.reply;
    await typewriterEffect(conn, m, m.chat, generatedText);
  } catch (error) {
    console.error(error);
    m.reply(`Oops! Something went haywire. Blame it on the gremlins, not us.`);
  }
};

handler.help = ['gpt4 <text>'];
handler.tags = ['AI'];
handler.command = /^(gpt4)$/i;

export default handler;

async function typewriterEffect(conn, quoted, from, text) {
  let { key } = await conn.sendMessage(from, { text: 'Whirring gears, bubbling potions... crafting your response!' }, { quoted: quoted });

  for (let i = 0; i < text.length; i++) {
    const partialText = text.slice(0, i + 1);
    await conn.relayMessage(from, {
      protocolMessage: {
        key: key,
        type: 14,
        editedMessage: {
          conversation: partialText
        }
      }
    }, {});

    await delay(100); // Adjust the delay time (in milliseconds) as needed
  }
}
