import fetch from 'node-fetch';

const handler = async (m, { conn, usedPrefix }) => {
  try {
    const { text } = m;
    
    if (!text) {
      throw 'Hey there! Give me something to work with - type or quote a message!';
    }

    m.react('🤖'); // Reaction before processing
    m.reply('Analyzing... 🤔');

    const encodedText = encodeURIComponent(text);
    const response = await Bing(encodedText);

    if (!response) {
      throw new Error('Oops! Didn\'t get a valid response. Maybe I need a coffee...');
    }

    await conn.reply(m.chat, response, m);

  } catch (error) {
    console.error(error);
    m.reply(`Oops! Something went wrong: ${error.message}`);
  }
};

handler.help = ['bing'];
handler.tags = ['AI'];
handler.command = ['bing'];

export default handler;

async function Bing(input) {
  const API_URL = 'https://copilot.github1s.tk/v1/chat/completions';

  try {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Authorization': 'dummy',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'Creative',
        max_tokens: 100,
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: input },
        ],
      }),
    };

    const response = await fetch(API_URL, requestOptions);
    const result = await response.json();

    return result.choices[0]?.message?.content || 'Hmm, I might need to attend comedy school for better responses!';
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching response from Bing. Maybe the joke\'s on me...');
  }
}
