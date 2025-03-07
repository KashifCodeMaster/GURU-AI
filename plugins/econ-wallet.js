let handler = async (m, { conn, usedPrefix }) => {
    let who = m.quoted ? m.quoted.sender : m.mentionedJid?.[0] || m.fromMe ? conn.user.jid : m.sender;
    if (!(who in global.db.data.users)) throw `🟨 The user is not found in my database`;

    let user = global.db.data.users[who];
    let username = conn.getName(who);
    
    let message = `👛 *Wallet | ${username}*\n\n🪙 *Gold* : ${user.credit}`;
    
    conn.reply(m.chat, message, m, { mentions: [who], quoted: m });
};

handler.help = ['wallet'];
handler.tags = ['economy'];
handler.command = ['wallet', 'gold'];

export default handler;
