import uploadImage from '../lib/uploadImage.js';
import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    try {
        m.react('📸');

        let quotedMessage = m.quoted ? m.quoted : m;
        let mimeType = quotedMessage.msg?.mimetype || '';

        if (!mimeType || !mimeType.includes('image')) {
            m.react('❓');
            throw '*Respond to an image containing a QR code.*';
        }

        let image = await quotedMessage.download?.();
        let imageUrl = await uploadImage(image);

        let response = await fetch(`https://api.lolhuman.xyz/api/read-qr?apikey=${lolkeysapi}&img=${imageUrl}`);
        let data = await response.json();

        if (!data.result) {
            m.react('❌');
            throw '*No valid QR code found in the image. Try with another image.*';
        }

        await m.reply(`*Here's the hidden message from the QR code:* ${data.result} 😉`);
        m.react('✅'); 
    } catch (error) {
        console.error('Error in readqr command:', error);
        m.react('⚠️');
        m.reply(`*❌ Oops! Something went wrong while decoding the QR code. Please try again.*`);
    }
};

handler.help = ['readqr'];
handler.command = /^(readqr)$/i;

export default handler;
