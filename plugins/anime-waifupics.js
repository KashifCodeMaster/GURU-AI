import fetch from 'node-fetch';

let handler = async (m, { conn, command }) => {
    m.react('⏳');

    let type = command.toLowerCase();
    let baseUrl = 'https://weeb-api.vercel.app/';

    const fetchImage = async (endpoint) => {
        try {
            const response = await fetch(baseUrl + endpoint);
            if (!response.ok) throw `❎ Failed to fetch ${type} image. My servers are on a coffee break!`;

            const imageBuffer = await response.buffer();
            conn.sendFile(m.chat, imageBuffer, 'img.jpg', `✨ Here's a random ${type} image, just for you!`, m);
            m.react('🔥');
        } catch (error) {
            console.error(error);
            m.react('😢');
            m.reply(`❎ Oops! Something went wrong fetching the ${type} image. Maybe the internet is on vacation too.`);
        }
    };

    switch (type) {
        case 'loli':
            fetchImage('loli');
            break;

        case 'waifu':
            fetchImage('waifu');
            break;

        case 'neko':
            fetchImage('neko');
            break;

        case 'zerotwo':
            fetchImage('zerotwo');
            break;

        default:
            break;
    }
};

handler.help = ['waifu', 'neko', 'zerotwo', 'loli'];
handler.tags = ['anime'];
handler.command = ['waifu', 'neko', 'zerotwo', 'loli'];

export default handler;
                   
