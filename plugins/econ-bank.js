let handler = async (m, { conn, usedPrefix }) => {
    let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    let user = global.db.data.users[who];
    let username = conn.getName(who);

    if (!(who in global.db.data.users)) throw `🚨 *Error: User Not Found!*  
🔍 *I searched high and low in my database… nothing!*  
💡 *Maybe try tagging someone who actually exists in this economy?*`;

    let bankBalance = user.bank || 0;
    let wealthStatus = "🏚️ Homeless (Tragic...)";

    if (bankBalance <= 3000) {
        wealthStatus = "😭 *Broke!* (Financially allergic)";
    } else if (bankBalance <= 6000) {
        wealthStatus = "😢 *Poor!* (Crawling towards survival)";
    } else if (bankBalance <= 100000) {
        wealthStatus = "💸 *Average!* (Middle-class dreams, broke reality)";
    } else if (bankBalance <= 1000000) {
        wealthStatus = "💰 *Rich!* (Might actually afford takeout)";
    } else if (bankBalance <= 10000000) {
        wealthStatus = "🤑 *Millionaire!* (Congrats, you're officially annoying)";
    } else if (bankBalance <= 1000000000) {
        wealthStatus = "🤑🤑 *Multi-Millionaire!* (Stop flexing already)";
    } else if (bankBalance <= 10000000000) {
        wealthStatus = "🤯 *Billionaire!* (Jeff Bezos is shaking)";
    } else {
        wealthStatus = "🚀 *Beyond Billionaire!* (The IRS is watching you)";
    }

    conn.reply(
        m.chat,
        `🏦 *The Grand Financial Report of ${username}*  

━━━━━━━━━━━━━━
💰 *Total Bank Balance:* _${bankBalance.toLocaleString()} Gold_  
📊 *Wealth Status:* ${wealthStatus}  
━━━━━━━━━━━━━━

📢 *Breaking News:*  
- *@${username}* has just checked their bank balance.  
- Authorities confirm they are officially *${wealthStatus.split(" ")[1]}!*  
- Experts suggest either *investing wisely* or *considering a job (if applicable).*  
- The stock market remains unaffected.  
━━━━━━━━━━━━━━  

⚠️ *Disclaimer:* If this financial situation causes emotional distress, please consult a rich friend for donations.  

*Type "${usedPrefix}work" to earn money like a responsible person.*  
        `,
        m,
        { mentions: [who] }
    );
};

handler.help = ["bank"];
handler.tags = ["economy"];
handler.command = ["bank", "vault"];

export default handler;
