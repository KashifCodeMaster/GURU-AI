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

        m.reply('*Pinging...*');
        let pingMsg = await conn.sendMessage(m.chat, { text: 'Pinging...' }, { quoted: silverFoxContact });
        let timestamp = speed();

        await exec('neofetch --stdout', async (error, stdout) => {
            let latency = (speed() - timestamp).toFixed(4);

            await conn.relayMessage(m.chat, {
                protocolMessage: {
                    key: pingMsg.key,
                    type: 14,
                    editedMessage: {
                        conversation: `🏓 *Pong!* \n\n🕒 *Latency:* ${latency} ms\n📶 *Ping Status:* ${
                            latency < 100 ? 'Excellent!' : latency < 200 ? 'Good' : latency < 300 ? 'Average' : 'Slow'
                        }`
                    }
                }
            }, {});

            m.react('🏓');
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
