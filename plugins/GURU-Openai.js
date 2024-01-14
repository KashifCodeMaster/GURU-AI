import fetch from 'node-fetch';

let handler = async (m, { text, conn, usedPrefix, command }) => {
  try {
    if (!text && !(m.quoted && m.quoted.text)) {
      throw 'Hey, I need some text or a quoted message to work with.';
    }

    if (!text && m.quoted && m.quoted.text) {
      text = m.quoted.text;
    }

    m.react('⌛'); // Reaction before processing
    const { key } = await conn.sendMessage(m.chat, {
      image: { url: 'https://i.imgur.com/775lqMv.jpg' }, // Updated image URL
      caption: 'Analyzing your thoughts... 🧠'
    }, { quoted: m });

    conn.sendPresenceUpdate('composing', m.chat);
    const prompt = encodeURIComponent(text);

    const guru1 = `${gurubot}/chatgpt?text=${prompt}`;

    try {
      let response = await fetch(guru1);
      let data = await response.json();
      let result = data.result;

      if (!result) {
        throw new Error('Hmm, no valid response from my first API. Let me try another approach.');
      }

      await conn.relayMessage(m.chat, {
        protocolMessage: {
          key,
          type: 14,
          editedMessage: {
            imageMessage: { url: 'https://i.imgur.com/775lqMv.jpg', caption: result } // Updated image URL
          }
        }
      }, {});
      m.react('✅'); // Reaction for success
    } catch (error) {
      console.error('Error from the first API:', error);

      const model = 'llama';
      const senderNumber = m.sender.replace(/[^0-9]/g, '');
      const session = `GURU_BOT_${senderNumber}`;
      const guru2 = `https://ultimetron.guruapi.tech/gpt3?prompt=${prompt}`;

      let response = await fetch(guru2);
      let data = await response.json();
      let result = data.completion;

      await conn.relayMessage(m.chat, {
        protocolMessage: {
          key,
          type: 14,
          editedMessage: {
            imageMessage: { url: 'https://i.imgur.com/775lqMv.jpg', caption: result } // Updated image URL
          }
        }
      }, {});
      m.react('✅'); // Reaction for success
    }

  } catch (error) {
    console.error('Error:', error);
    m.react('❌'); // Reaction for error
    throw 'Whoops! Something went off course. I\'ll get back on track, promise.';
  }
};

handler.help = ['chatgpt'];
handler.tags = ['AI'];
handler.command = ['bro', 'chatgpt', 'ai', 'gpt'];

export default handler;
                              
