let maxRob = 3000;

let handler = async (m, { conn, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender];

    // **Cooldown Check - No impatient thieves allowed!**
    let cooldown = 7200000; // 2 hours
    let remainingTime = user.lastrob + cooldown - new Date();
    if (remainingTime > 0) {
        throw `⏳ *Whoa there, sticky fingers!*  
🛑 *You just tried robbing someone ${msToTime(cooldown)} ago!*  
🔄 *Come back in* _${msToTime(remainingTime)}_ *when the heat dies down.*  
💡 *Maybe try a legal job in the meantime? Oh wait… that’s too much work, isn’t it?*`;
    }

    // **Target Selection - Who's getting robbed today?**
    let who;
    if (m.isGroup) {
        who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false;
    } else {
        who = m.chat;
    }
    if (!who) throw `🤦 *Tag someone, genius!*  
🎯 *I can't read minds (yet), so at least point at your victim properly!*`;

    if (!(who in global.db.data.users)) throw `❌ *Target not found!*  
🔎 *Did you just try robbing a ghost? This person doesn’t exist in my database!*`;

    let target = global.db.data.users[who];

    // **XP Calculation - How much are we stealing?**
    let robAmount = Math.floor(Math.random() * maxRob);

    // **Prevent robbing broke people - No honor among thieves, but c'mon…**
    if (target.exp < robAmount) {
        return m.reply(`😆 *Nice try, but your target is as broke as your morals!*  
🪙 *@${who.split`@`[0]}* barely has _${target.exp} XP._  
💀 *You can’t rob what isn’t there, dummy.*  
💡 *Next time, do your research before you pull off a heist!*`, null, { mentions: [who] });
    }

    // **Transaction - Congratulations, you’re officially a criminal**
    user.exp += robAmount;
    target.exp -= robAmount;

    m.reply(`
💰 *🚨 HEIST SUCCESSFUL! 🚨*  
👤 *Thief:* @${m.sender.split`@`[0]}  
💀 *Victim:* @${who.split`@`[0]}  
💸 *Stolen XP:* *${robAmount} XP*  
🏃‍♂️ *Run before they call the cops!*  
    
*📢 Breaking News:* A desperate individual, *@${m.sender.split`@`[0]}*, has successfully committed daylight robbery, snatching *${robAmount} XP* from *@${who.split`@`[0]}*. Eyewitnesses describe it as ‘pathetic yet amusing.’ Authorities urge all citizens to hold their XP tightly!`, null, { mentions: [m.sender, who] });

    // **Cooldown Timer - Preventing non-stop robbery sprees**
    user.lastrob = new Date() * 1;
};

handler.help = ['rob'];
handler.tags = ['economy'];
handler.command = ['robar', 'rob'];

export default handler;

// **Time Formatter - Because thieves need to read clocks too**
function msToTime(duration) {
    let seconds = Math.floor((duration / 1000) % 60);
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    return `${hours} hour(s), ${minutes} minute(s), and ${seconds} second(s)`;
}
