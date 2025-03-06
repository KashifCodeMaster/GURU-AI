import fetch from 'node-fetch';

let handler = async (m, { text, conn, usedPrefix, command }) => {
    if (!text) return m.reply(`🚨 *Error!* You forgot to include a word. Try again:\n*${usedPrefix + command} [word]*`);

    let url = `https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(text)}`;

    try {
        let res = await fetch(url);
        let json = await res.json();

        if (!json.list.length) return m.reply(`❌ *Not Found!* Even Urban Dictionary refuses to acknowledge "${text}". Maybe try using *real* words for once?`);

        let { definition, example, thumbs_up, thumbs_down, author } = json.list[0];

        let message = `
📖 *Urban Dictionary*
──────────────
🧬 *Word:* *${text}*
📌 *Definition:*  
_${definition.replace(/\[|\]/g, '')}_  

📝 *Example:*  
"${example.replace(/\[|\]/g, '')}"  

👍 *Upvotes:* ${thumbs_up}   👎 *Downvotes:* ${thumbs_down}  
✍️ *Defined by:* ${author}  
──────────────
`.trim();

        m.reply(message);
    } catch (e) {
        m.reply(`🔥 *Error!* Urban Dictionary seems to be down, or maybe it's just trying to avoid you. Try again later.`);
    }
};

handler.help = ['define'];
handler.tags = ['tools'];
handler.command = ['define'];

export default handler;
