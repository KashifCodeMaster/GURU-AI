import { exec } from 'child_process';
import speed from 'performance-now';

let handler = async (m, { conn }) => {
    try {
        let thumbnail = 'https://www.guruapi.tech/K.jpg';
        let silverFoxContact = {
            key: {
                fromMe: false,
                participant: `0@s.whatsapp.net`,
                remoteJid: 'status@broadcast'
            },
            message: {
                contactMessage: {
                    displayName: `Silver Fox`,
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:'Silver Fox'\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
                }
            }
        };

        m.react('🏓'); // Reaction before the reply

        let pingMsg = await conn.sendMessage(m.chat, { text: 'Pinging...' }, { quoted: silverFoxContact });
        let timestamp = speed();

        await exec('neofetch --stdout', async (error, stdout) => {
            let latency = (speed() - timestamp).toFixed(4);

            let response = `🏓 *Pong!* \n\n🕒 *Latency:* ${latency} ms\n📶 *Ping Status:* ${
                latency < 10 ? 'Super Sonic! 🚀' : latency < 20 ? 'Excellent!' : latency < 50 ? 'Good' : latency < 100 ? 'Average' : 'Slow'
            }`;

            if (latency > 50) {
                response += '\n💡 *Tip:* Maybe the server is enjoying a coffee break ☕';
            }

            await conn.relayMessage(m.chat, {
                protocolMessage: {
                    key: pingMsg.key,
                    type: 14,
                    editedMessage: {
                        conversation: response
                    }
                }
            }, {});
        });
    } catch (error) {
        console.error('Error in ping command:', error);
        m.reply('*Oops! Something went wrong while pinging.*');
    }
};

handler.help = ['ping'];
handler.tags = ['main'];
handler.command = ['ping', 'speed'];
export default handler;
