let handler = async (m, { conn, text }) => {
  let who = m.isGroup ? m.mentionedJid[0] : m.chat;
  if (!who) throw '✳️ Tag a user, unless you’re trying to give XP to thin air.';

  let txt = text.replace('@' + who.split`@`[0], '').trim();
  if (!txt) throw '✳️ Enter how much *XP* you want to add. Or should I just guess?';

  if (isNaN(txt)) throw '🔢 I said numbers, not your hopes and dreams.';
  let xp = parseInt(txt);
  if (xp < 1) throw '✳️ The minimum is *1* XP. Even your bad decisions aren’t that low.';

  let users = global.db.data.users;
  users[who].exp += xp;

  await m.reply(
    `✅ *XP Successfully Added!*  
    ───────────────  
    👤 *User:* @${who.split`@`[0]}  
    🔼 *XP Gained:* ${xp}  
    📊 *New Total:* ${users[who].exp} XP  
    ───────────────  
    Now go forth and waste it on something equally pointless.`
  );

  conn.fakeReply(m.chat, `⚡ *Boom!* You just got *+${xp} XP!* Use it wisely. Or don’t.`, who, m.text);
};

handler.help = ['addxp <@user> <amount>'];
handler.tags = ['economy'];
handler.command = ['addxp'];
handler.rowner = true;

export default handler;
