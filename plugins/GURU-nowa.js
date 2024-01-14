let handler = async (m, { conn, text, usedPrefix, command }) => {
    m.react('🔍');

    if (!text) {
        m.reply(`
👀 *WhatsApp Account Checker*

This command checks the existence of WhatsApp accounts based on a given number pattern. Provide a number pattern with 'x' to see if corresponding accounts exist.

*Example:* ${usedPrefix}checkwa 91760590201x

🤔 *Tip: Use 'x' in the number pattern to generate various combinations for checking.*`);
        return;
    }

    let regex = /x/g;

    if (!text.match(regex)) {
        m.reply(`
❌ *Invalid Format!*

Please use a number pattern with 'x' to check WhatsApp accounts.

*Example:* ${usedPrefix}checkwa 91760590201x`);
        return;
    }

    let random = text.match(regex).length,
        total = Math.pow(10, random),
        array = [];

    for (let i = 0; i < total; i++) {
        let list = [...i.toString().padStart(random, '0')];
        let result = text.replace(regex, () => list.shift()) + '@s.whatsapp.net';

        if (await conn.onWhatsApp(result).then(v => (v[0] || {}).exists)) {
            let info = await conn.fetchStatus(result).catch(_ => {});
            array.push({ exists: true, jid: result, ...info });
        } else {
            array.push({ exists: false, jid: result });
        }
    }

    m.react('✅');

    let registeredText = '📱 *Registered Numbers:*\n\n' + array.filter(v => v.exists).map(v =>
        `• Link: wa.me/${v.jid.split('@')[0]}\n*• Bio:* ${v.status || 'No bio available'}\n*• Set on:* ${formatDate(v.setAt)}`
    ).join('\n\n');

    let notRegisteredText = '\n\n🔍 *Not Registered Numbers:*\n\n' + array.filter(v => !v.exists).map(v => `• ${v.jid.split('@')[0]}`).join('\n');
    
    let responseText = registeredText + notRegisteredText;
    m.reply(responseText);
};

handler.help = ['checkwa'];
handler.tags = ['tools'];
handler.command = /^checkwa$/i;
export default handler;

function formatDate(n, locale = 'en-US') {
    let d = new Date(n);
    return d.toLocaleDateString(locale, { timeZone: 'UTC', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
}
