import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text) {
      throw `Sure, I can generate images from text prompts. Give it a try!\n\n*Example usage:*\n*◉ ${usedPrefix + command} Beautiful anime girl*\n*◉ ${usedPrefix + command} Elon Musk in pink output*`;
    }

    m.react('🎨'); // Reaction before processing
    m.reply('*Processing your creative request...*');

    const endpoint = `https://gurugpt.cyclic.app/dalle?prompt=${encodeURIComponent(text)}`;
    const response = await fetch(endpoint);

    if (response.ok) {
      const imageBuffer = await response.buffer();
      await conn.sendFile(m.chat, imageBuffer, 'generated_image.png', null, m);
    } else {
      m.react('❌'); // Reaction for error
      throw '*Image generation failed*';
    }
  } catch (error) {
    console.error(error);
    m.react('❌'); // Reaction for error
    throw '*Uh-oh! Something went awry while turning words into art. Give me another shot later.*';
  }
};

handler.help = ['dalle'];
handler.tags = ['AI'];
handler.command = ['dalle', 'gen', 'gimg', 'openai2'];
export default handler;
