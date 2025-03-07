import fetch from 'node-fetch';

let timeout = 120000; // 2 minutes
let reward = 4999; // XP reward

let handler = async (m, { conn, command, usedPrefix }) => {
    conn.tebakbendera = conn.tebakbendera || {};
    let id = m.chat;

    if (id in conn.tebakbendera) {
        conn.reply(m.chat, '⚠️ *There is already an active game in this chat, you impatient fool!*', conn.tebakbendera[id][0]);
        throw false;
    }

    let src = await (await fetch('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakbendera2.json')).json();
    let json = src[Math.floor(Math.random() * src.length)];

    let caption = `
🌍 *GUESS THE FLAG CHALLENGE* 🚩  
──────────────────────────  
⏳ *Time Limit:* ${(timeout / 1000).toFixed(2)} seconds  
💡 *Need a hint?* Use: *${usedPrefix}fhint*  
🎁 *Reward:* ${rewardXP} XP  
🧠 *HOW TO ANSWER:* Simply type the *correct country name* in the chat!  

⚠️ *If you surrender like the weak human you are, type:* *surrender*
──────────────────────────  

⌛ *Think fast, human. If your brain can handle it...*
`.trim();

    conn.tebakbendera[id] = [
        await conn.sendFile(m.chat, json.img, '', caption, m),
        json, reward,
        setTimeout(() => {
            if (conn.tebakbendera[id]) {
                conn.reply(m.chat, `⏳ *Time's up, you slow-thinking primate!*  
📢 *Correct Answer:* *${json.name}*`, conn.tebakbendera[id][0]);
                delete conn.tebakbendera[id];
            }
        }, timeout)
    ];
};

handler.help = ['guessflag'];
handler.tags = ['game'];
handler.command = /^guessflag/i;

export default handler;
