let handler = async (m, { conn, usedPrefix }) => {
    try {
        // React first for user engagement
        m.react('🕰️');

        // Retrieve uptime information
        let _muptime;
        if (process.send) {
            process.send('uptime');
            _muptime = await new Promise((resolve) => {
                process.once('message', resolve);
                setTimeout(resolve, 1000);
            }) * 1000;
        }

        // Format uptime for display
        let muptime = clockString(_muptime);
        let formattedUptime = formatUptime(_muptime);

        // Build the response message with more humor and variety
        let response = `👋 *@${m.sender.split('@')[0]}*, my exceptional user! Silver Fox reporting for duty and tirelessly operational for*\n\n⏳ *${muptime}*\n\n🚀 *Did you know? While you blink, I process commands - multitasking at its finest!*`;

        // Add additional information based on uptime
        if (formattedUptime !== '0 seconds') {
            response += `\n\n🌐 *Oh, the tales I could tell during my ${formattedUptime} of service!*`;

            if (formattedUptime.includes('days')) {
                response += `\n\n🕰️ *Longevity Tip: Consistency is my secret, just like a reliable cup of coffee.* ☕`;
            }
        }

        response += `\n\n🛠️ *Maintaining peak performance since initialization - like a well-oiled machine.*`;

        // Quote the user's command when sending the uptime message
        conn.sendMessage(m.chat, { text: response, contextInfo: { mentionedJid: [m.sender], isForwarded: true, forwardingScore: 999, externalAdReply: { showAdAttribution: true } }, quoted: m });
    } catch (error) {
        console.error('Error in runtime command:', error);
        m.reply('*🚨 Uh-oh! Something went haywire in my circuits. Must be those mischievous electrons.*');
    }
};

// Function to format uptime in clock format
function clockString(ms) {
    let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000);
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24;
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
    return [d, 'd ', h, 'h ', m, 'm ', s, 's'].map((v) => v.toString().padStart(2, 0)).join('');
}

// Function to format uptime in a human-readable string
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

handler.help = ['runtime'];
handler.tags = ['main'];
handler.command = ['runtime', 'uptime'];
export default handler;
