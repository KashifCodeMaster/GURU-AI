import fetch from 'node-fetch';
import displayLoadingScreen from '../lib/loading.js';

const endpoint = 'https://v2-guru-indratensei.cloud.okteto.net/perplexity?query=';

let handler = async (m, { text, conn, usedPrefix, command }) => {
  try {
    if (!text && !(m.quoted && m.quoted.text)) {
      throw 'Hold on! I need some text or a quoted message to analyze.';
    }

    if (!text && m.quoted && m.quoted.text) {
      text = m.quoted.text;
    } else if (text && m.quoted && m.quoted.text) {
      text = `${text} ${m.quoted.text}`;
      if (m.quoted.text.includes('.aisearch')) {
        text = text.replace('.aisearch', ''); // Removing a specific suffix
      }
    }

    await displayLoadingScreen(conn, m.chat);
    conn.sendPresenceUpdate('composing', m.chat);

    let emsg = await conn.sendMessage(m.chat, { text: 'Analyzing your thoughts... 🤔' });

    const prompt = encodeURIComponent(text);
    const response = await fetch(endpoint + prompt);

    if (!response.ok) {
      throw `Uh-oh! The server didn't like my request: ${response.status} - ${response.statusText}`;
    }

    const data = await response.json();
    const result = data.response.trim();

    await conn.relayMessage(m.chat, {
      protocolMessage: {
        key: emsg.key,
        type: 14,
        editedMessage: {
          conversation: result
        }
      }
    }, {});

    m.react('✅'); // Reaction for success
  } catch (error) {
    console.error('Error:', error);
    m.react('❌'); // Reaction for error
    m.reply('Oops! Something went a bit haywire while analyzing. Give me another shot, please!');
  }
};

handler.help = ['aisearch'];
handler.tags = ['AI'];
handler.command = ['aisearch', 'ai2'];

export default handler;
                     
