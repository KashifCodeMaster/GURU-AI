let handler = async (m, { conn, args, groupMetadata }) => {
    let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    if (!(who in global.db.data.users)) throw `❌ *User not found* in the database.`;

    let warn = global.db.data.users[who].warn;
    let name = conn.getName(who);

    m.reply(`
📊 *Warning Status*

👤 *User:* ${name}
⚠️ *Warnings:* ${warn}/${global.maxwarn}

P.S.: Remember, ${warn >= global.maxwarn ? 'you’re at the limit!' : 'you’ve still got some room for mistakes.'}`);
}

handler.help = ['warns'];
handler.tags = ['group'];
handler.command = ['warns'];
handler.group = true;

export default handler;
