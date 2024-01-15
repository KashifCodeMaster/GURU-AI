const handler = async (m, { conn }) => {
  try {
    m.react('😄'); 

    const res = await fetch('https://some-random-api.com/animu/quote');
    if (!res.ok) throw 'Failed to fetch anime quote.';

    const { sentence, character, anime } = await res.json();

    const message = `📜 *Anime Quote:*\n${sentence}\n\n👤 *Character:*\n\`${character}\`\n🐶 *Anime:*\n\`${anime}\``;
    conn.sendMessage(m.chat, { text: message }, 'extendedTextMessage', { quoted: m });
  } catch (error) {
    console.error(error);

    m.react('🥺'); //
    m.reply('😅 Oops! The anime quote is taking a break. Please try again later.');
  }
};

handler.help = ['animequote'];
handler.tags = ['fun', 'anime'];
handler.command = /^(animequote)$/i;

export default handler;
