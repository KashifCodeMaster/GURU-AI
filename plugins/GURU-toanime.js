import uploadImage from '../lib/uploadImage.js';

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
    let quotedMessage = m.quoted ? m.quoted : m;
    let mimeType = quotedMessage.msg ? quotedMessage.msg.mimetype : quotedMessage.mediaType || "";
    
    if (!/image/g.test(mimeType)) {
        m.react('❌');
        throw '*🚫 Error!* Respond to an image to turn it into anime.';
    }

    m.react('⚙️');
    m.reply('*🎨 Transforming your photo into anime...*');
    
    let imageData = await quotedMessage.download?.();
    let uploadedImage = await uploadImage(imageData);

    try {
        let animeUrl = `https://api.lolhuman.xyz/api/imagetoanime?apikey=${lolkeysapi}&img=${uploadedImage}`;
        await conn.sendFile(m.chat, animeUrl, 'anime.jpg', null, m);
        m.react('✅');
    } catch (error1) {
        try {
            let anime2Url = `https://api.zahwazein.xyz/photoeditor/jadianime?url=${uploadedImage}&apikey=${keysxxx}`;
            await conn.sendFile(m.chat, anime2Url, 'anime.jpg', null, m);
            m.react('✅');
        } catch (error2) {
            try {
                let anime3Url = `https://api.caliph.biz.id/api/animeai?img=${uploadedImage}&apikey=caliphkey`;
                await conn.sendFile(m.chat, anime3Url, 'anime.jpg', null, m);
                m.react('✅');
            } catch (error3) {
                m.react('❌');
                throw '*🚫 Error!* Check if the person\'s face is visible in the image.';
            }
        }
    }
};

handler.help = ["toanime"];
handler.tags = ["AI"];
handler.diamond = true;
handler.command = /^(imagetoanime|toanime)$/i;
export default handler;
