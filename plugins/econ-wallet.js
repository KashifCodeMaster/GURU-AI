let handler = async (m, { conn, usedPrefix }) => {
    let who = m.quoted ? m.quoted.sender : m.mentionedJid?.[0] || m.fromMe ? conn.user.jid : m.sender;
    if (!(who in global.db.data.users)) throw `🟨 The user is not found in my database. Make sure they have interacted with the bot before.`;

    let user = global.db.data.users[who];
    let username = conn.getName(who);
    
    let message = `📜 *Wallet Summary for ${username}* 📜

💰 *Current Balance*: 🪙 ${user.credit.toLocaleString()} gold  
🏦 *Bank Balance*: 🏛️ ${user.bank.toLocaleString()} gold  
📊 *Total Assets*: 🏆 ${(user.credit + user.bank).toLocaleString()} gold  

🔹 *Use this command to manage your gold*:  
${usedPrefix}deposit <amount> → Move gold to your bank  
${usedPrefix}withdraw <amount> → Withdraw gold from your bank  

⚠️ *Note:* Keep your gold safe by depositing it in the bank to prevent potential loss.  
`;

    conn.reply(m.chat, message, m, { mentions: [who], quoted: m });
};

handler.help = ['wallet'];
handler.tags = ['economy'];
handler.command = ['wallet', 'gold'];

export default handler;
