let { downloadContentFromMessage } = (await import('@whiskeysockets/baileys'));

var handler = async (m, { conn }) => {
    try {
        if (!m.quoted) {
            m.reply('❌ You must *reply* to a View Once message.');
            console.error('[ERROR] No message was quoted.');
            return;
        }

        if (!/viewOnce/.test(m.quoted?.mtype)) {
            m.reply('✳️❇️ This is *not* a View Once message.');
            console.error('[ERROR] The quoted message is not a View Once message.');
            return;
        }

        let mtype = Object.keys(m.quoted.message)[0];
        let buffer = await m.quoted.download();
        let caption = m.quoted.message[mtype]?.caption || '';

        await conn.sendMessage(m.chat, { [mtype.replace(/Message/, '')]: buffer, caption }, { quoted: m });

    } catch (error) {
        m.reply('⚠️ An error occurred while processing the View Once message.');
        console.error('[ERROR] Failed to process View Once message:', error);
    }
};

handler.help = ['readvo'];
handler.tags = ['tools'];
handler.command = ['readviewonce', 'read', 'ver', 'readvo'];

export default handler;
