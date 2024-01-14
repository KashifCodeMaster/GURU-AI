import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyDJC5a882ruaC4XL6ejY1yhgRkN-JNQKg8');

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  try {
    if (!text) throw `Come on! Don't be shy. What do you want to talk about?`;
    
    m.react('🤖');
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = text;

    // Send a message before editing
    const preEditMsg = await conn.sendMessage(m.chat, 'Cooking up a response... 🍳');

    const result = await model.generateContent(prompt);
    const response = result.response;
    const generatedText = response.text();

    await conn.relayMessage(m.chat, {
      protocolMessage: {
        key: preEditMsg.key,
        type: 14,
        editedMessage: {
          conversation: generatedText
        }
      }
    }, {});

  } catch (error) {
    console.error(error);
    m.reply('Oops! Something went wrong. Let me try to gather my thoughts again.');
  }
};

handler.help = ['gemini <text>'];
handler.tags = ['AI'];
handler.command = /^(gemini)$/i;

export default handler;
