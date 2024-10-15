let war = global.maxwarn;
let cooldown = new Set(); // Cooldown set to prevent spamming warnings

let handler = async (m, { conn, text, args, groupMetadata, usedPrefix, command }) => {      
    let who;
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false;
    else who = m.chat;
    if (!who) throw `⚠️ *Oops!* You forgot to mention someone.\n\n📌 Example: ${usedPrefix + command} @user`;

    if (!(who in global.db.data.users)) throw `❌ *User not found* in my super-secret database.`;

    let name = conn.getName(m.sender);
    let warn = global.db.data.users[who].warn;

    // Cooldown logic: Check if the user is still in cooldown
    if (cooldown.has(who)) {
        m.reply(`😬 *Hold your horses!* You've recently warned this user. Please wait a bit.`);
        return;
    }

    if (warn < war) {
        global.db.data.users[who].warn += 1;
        m.reply(`
📜 *Warning Issued!*

👮‍♂️ *Admin:* ${name}
👤 *User:* @${who.split`@`[0]}
⚠️ *Warnings:* ${warn + 1}/${war}
📝 *Reason:* ${text ? text : 'No reason given. Just don’t mess up again!'}

P.S.: You're on thin ice, my friend!`, null, { mentions: [who] });

        // Countdown to getting kicked (just for drama)
        if (warn + 1 === war) {
            m.reply(`
⏳ *Warning Alert!*

@${who.split`@`[0]}, you've hit *${warn + 1}/${war}* warnings. One more, and you're getting the boot!

🚨 Tick... tock... better behave!`, null, { mentions: [who] });
        }

        // Add user to cooldown to prevent immediate warnings
        cooldown.add(who);
        setTimeout(() => cooldown.delete(who), 60000); // Cooldown of 60 seconds
    } else if (warn == war) {
        global.db.data.users[who].warn = 0;
        m.reply(`🚪 *Exit time!* You've hit *${war}* warnings. Farewell!`);

        await time(3000); // Wait for the drama to unfold
        await conn.groupParticipantsUpdate(m.chat, [who], 'remove');
        
        // Final removal message
        m.reply(`😎 *User Removed!*
        
User @${who.split`@`[0]} was ejected from the group *${groupMetadata.subject}* for hitting the warning limit.`, null, { mentions: [who] });
    }
}

handler.help = ['warn @user'];
handler.tags = ['group'];
handler.command = ['warn'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;

const time = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
