let handler = async (m, { conn, args, groupMetadata }) => {
    let who;
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false;
    else who = m.chat;

    if (!who) throw `⚠️ *Oops!* You forgot to tag someone.`;
    if (!(who in global.db.data.users)) throw `❌ *User not found* in the database.`;

    let warn = global.db.data.users[who].warn;

    if (warn > 0) {
        global.db.data.users[who].warn -= 1;
        m.reply(`
🧹 *Warning Cleared!*

👤 *User:* @${who.split`@`[0]}
⚠️ *Warns Remaining:* ${warn - 1}`, null, { mentions: [who] });
    } else if (warn == 0) {
        m.reply(`📢 *All Clear!* This user has no warnings to remove.`);
    }
}

handler.help = ['delwarn @user', 'unwarn @user'];
handler.tags = ['group'];
handler.command = ['delwarn', 'unwarn'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
