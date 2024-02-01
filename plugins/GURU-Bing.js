import fetch from 'node-fetch';

const handler = async (m, { conn, usedPrefix }) => {
  try {
    const { text } = m;

    if (!text) {
      return conn.reply(m.chat, 'Hey there! I can assist you better if you give me something to work with. Type or quote a message!', m);
    }

    m.react('🗃️');
    conn.reply(m.chat, 'Analyzing... 🧐', m);

    const encodedText = encodeURIComponent(text);
    const response = await Bing(encodedText);

    if (!response) {
      return conn.reply(m.chat, "Oops! My neural circuits seem to be tangled. Couldn't find a valid response. Maybe I need a debugging session... 🤖💡", m);
    }

    await conn.reply(m.chat, response, m);

  } catch {
    conn.reply(m.chat, "Yikes! Something went haywire in my digital realm. 🤖🔥 Please try again later.", m);
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

    return result.choices[0]?.message?.content || "Hmm, I might need a crash course in comedy for better responses! 🤖🎭";
  } catch {
    return "Error fetching response from Bing. It seems the joke's on me... 🤖🤷‍♂️";
  }
}
