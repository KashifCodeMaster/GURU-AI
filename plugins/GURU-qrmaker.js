import { toDataURL } from 'qrcode';

let handler = async (m, { text, conn }) => {
    if (!text) {
        throw `🚫 *Error!* Provide a text to generate a QR code.\n\n*Example:* !qr Hello, World!`;
    }

    if (text.length > 2048) {
        throw `🚫 *Error!* The provided text is too long. Please provide a shorter text for QR code generation.`;
    }

    try {
        m.reply('*🔍 Generating QR Code...*');
        const qrCodeDataUrl = await toDataURL(text, { scale: 8 });
        conn.sendFile(m.chat, qrCodeDataUrl, 'qrcode.png', '🎉 Here is your QR code!', m);
    } catch (error) {
        console.error(error);
        throw `🚫 *Error!* Failed to generate QR code. Please try again.`;
    }
};

handler.help = ['qrcodegen <text>']; // Only one command added to help for menu list
handler.tags = ['tools'];
handler.command = /^qr(code)?(gen)?$/i;
export default handler;
