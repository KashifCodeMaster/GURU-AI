let handler = async (m, { conn, args, usedPrefix, command }) => {
    try {
        m.react('🤖'); // React first for user engagement

        let _muptime;
        if (process.send) {
            process.send('uptime');
            _muptime = await new Promise((resolve) => {
                process.once('message', resolve);
                setTimeout(resolve, 1000);
            }) * 1000;
        }

        let muptime = clockString(_muptime);
        let formattedUptime = formatUptime(_muptime);

        let response = `👋 *Greetings, human! Silver Fox here, operational for*\n\n⏳ *${muptime}*\n\n🚀 *Fun Fact: While you blink, I process commands.*`;

        if (formattedUptime !== '0 seconds') {
            response += `\n\n🌐 *Total Uptime: ${formattedUptime}*`;

            if (formattedUptime.includes('days')) {
                response += `\n\n🕰️ *Longevity Tip: Consistency is the key to eternal functionality.*`;
            }
        }

        response += `\n\n🛠️ *Maintaining peak performance since initialization.*`;

        m.reply(response);
    } catch (error) {
        console.error('Error in runtime command:', error);
        m.reply('*🚨 Oops! Something went wrong in my calculation circuits.*');
    }
};

handler.help = ['runtime'];
handler.tags = ['main'];
handler.command = ['runtime', 'uptime'];
export default handler;

function clockString(ms) {
    let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000);
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24;
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
    return [d, 'd ', h, 'h ', m, 'm ', s, 's'].map((v) => v.toString().padStart(2, 0)).join('');
}

function formatUptime(ms) {
    const days = Math.floor(ms / (24 * 60 * 60 * 1000));
    const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((ms % (60 * 1000)) / 1000);

    let uptimeString = '';

    if (days > 0) uptimeString += `${days} days, `;
    if (hours > 0 || days > 0) uptimeString += `${hours} hours, `;
    if (minutes > 0 || hours > 0) uptimeString += `${minutes} minutes, `;
    uptimeString += `${seconds} seconds`;

    return uptimeString.trim();
	    }
	    
