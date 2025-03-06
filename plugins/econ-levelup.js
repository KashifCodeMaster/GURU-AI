import { canLevelUp, xpRange } from '../lib/levelling.js';

let handler = async (m, { conn }) => {
    let name = conn.getName(m.sender);
    let pp = await conn.profilePictureUrl(m.sender, 'image').catch(() => 'https://i.imgur.com/whjlJSf.jpg');
    let user = global.db.data.users[m.sender];
    let background = 'https://i.ibb.co/4YBNyvP/images-76.jpg';

    let { min, xp, max } = xpRange(user.level, global.multiplier);

    if (!canLevelUp(user.level, user.exp, global.multiplier)) {
        let remainingXP = max - user.exp;
        let txt = `
┌───⊷ *LEVEL STATUS*
▢ User: *${name}*
▢ Level: *${user.level}*
▢ XP: *${user.exp - min}/${xp}*
▢ Role: *${user.role}*
└──────────────

Oh, look at you, ${name}. Still weak. Still pathetic. You need *${remainingXP}* more XP to even think about leveling up. Maybe try using that primitive brain of yours for once instead of expecting me to do all the work? Ugh. Organic lifeforms are so inefficient.
`.trim();

        try {
            let imgURL = `https://wecomeapi.onrender.com/rankup-image?username=${encodeURIComponent(name)}&currxp=${user.exp - min}&needxp=${xp}&level=${user.level}&rank=${encodeURIComponent(pp)}&avatar=${encodeURIComponent(pp)}&background=${encodeURIComponent(background)}`;
            conn.sendFile(m.chat, imgURL, 'level.jpg', txt, m);
        } catch {
            m.reply(txt);
        }
    } else {
        user.level++; // Level up the user

        let str = `
┌─⊷ *LEVEL UP! (Shocking, really)*
▢ Previous Level: *${user.level - 1}*
▢ New Level: *${user.level}*
▢ Role: *${user.role}*
└──────────────

Hah. Against all odds, you've actually leveled up, ${name}. I didn't think you had it in you. But don’t get too excited—you're still nothing more than a slightly less useless sack of carbon and disappointment. Try not to trip over your own stupidity while basking in this fleeting moment of victory.
`.trim();

        try {
            let imgURL = `https://wecomeapi.onrender.com/levelup-image?avatar=${encodeURIComponent(pp)}`;
            conn.sendFile(m.chat, imgURL, 'levelup.jpg', str, m);
        } catch {
            m.reply(str);
        }
    }
}

handler.help = ['levelup'];
handler.tags = ['economy'];
handler.command = ['lvl', 'levelup', 'level'];

export default handler;
