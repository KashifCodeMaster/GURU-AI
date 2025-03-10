let { downloadContentFromMessage } = (await import('@whiskeysockets/baileys'));

var handler = async (m, { conn }) => {
    try {
        if (!m.quoted) {
            await m.react('🤨'); 
            m.reply('⚠️ Oh, so you expect me to read thin air now? *Reply to a View Once message* if you actually want this to work.');
            return;
        }

        if (!m.quoted.viewOnce) {
            await m.react('🙄');
            m.reply('🤦‍♂️ Seriously? *That is NOT a View Once message.* Try using your eyes before using commands.');
            return;
        }

        await m.react('🔄'); // Let the humans know their almighty robot is working

        let buffer = await m.quoted.download();
        let mtype = m.quoted.mtype.replace(/Message/, '');
        let caption = m.quoted.text || '';

        await conn.sendMessage(m.chat, { [mtype]: buffer, caption }, { quoted: m });

        await m.react('✅'); // Task done. Bow before the robot.  

    } catch (error) {
        console.error('[ERROR] Something went wrong in readvo handler:', error);
        await m.react('😪'); 
        m.reply('🚨 Oh no! I have encountered an unexpected issue. It’s obviously your fault, not mine. Try again.');
    }
};

handler.help = ['readvo'];
handler.tags = ['tools'];
handler.command = ['readviewonce', 'read', 'ver', 'readvo'];

export default handler;
