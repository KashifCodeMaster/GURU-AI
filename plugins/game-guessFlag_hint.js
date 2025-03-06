let handler = async (m, { conn }) => {
    conn.tebakbendera = conn.tebakbendera || {};
    let id = m.chat;

    if (!(id in conn.tebakbendera)) throw false;

    let json = conn.tebakbendera[id][1];
    let hint = json.name.replace(/[AIUEOaiueo]/g, '_'); // Replace vowels with underscores

    conn.reply(m.chat, `🤖 *Here's your hint, weakling:*  
\`\`\`${hint}\`\`\`  
💡 *Good luck, if that's even possible for you.*`, m);
};

handler.command = /^fhint$/i;

export default handler;
