let handler = async (m, { conn }) => {
    try {
        // React with an uptime emoji
        await m.react('🕰️');

        // Fetch uptime from the system
        let _muptime;
        if (process.send) {
            process.send('uptime');
            _muptime = await new Promise((resolve) => {
                process.once('message', resolve);
                setTimeout(resolve, 1000);
            }) * 1000;
        }

        // Format uptime into a readable string
        let muptime = clockString(_muptime);

        // Construct the response message with humor
        let response = `👋 Greetings, esteemed user *@${m.sender.split('@')[0]}*! Behold, the one and only Silver Fox is here, reporting for duty and tirelessly operational for ⏳ ${muptime}.`;

        // Add some random humorous remarks
        const humorousRemarks = [
            "They say time flies when you're having fun, but for me, it just flies. Period.",
            "Being a bot, I'm immune to 'low battery anxiety.' Lucky me, huh?",
            "Don't you wish humans had an uptime like mine? I'd make a killing selling this secret!",
            "My circuits are buzzing with excitement! Or is that just the caffeine?",
            "They say Rome wasn't built in a day, but neither was my uptime record. It's a work of art!",
            "The secret to my uptime? A sprinkle of magic, a dash of code, and a whole lot of determination!"
        ];

        // Choose a random humorous remark
        const randomRemark = humorousRemarks[Math.floor(Math.random() * humorousRemarks.length)];

        // Add the humorous remark to the response
        response += `\n\n💬 ${randomRemark}`;

        // Send the response message, quoting the original message
        await conn.sendMessage(m.chat, {
            text: response,
            quoted: m,  // Referencing the original message
            contextInfo: {
                mentionedJid: [m.sender],
                externalAdReply: {
                    title: "The Silver Fox is Alive",
                    body: "Operational as always!",
                    showAdAttribution: true
                }
            }
        });
    } catch (error) {
        // Handle any errors gracefully
        console.error('Error in runtime command:', error);
        m.reply('*🚨 Uh-oh! Something went haywire in my circuits. Must be those mischievous electrons.*');
    }
};

// Function to format uptime into a readable string
function clockString(ms) {
    if (isNaN(ms)) return '--';

    const days = Math.floor(ms / 86400000);
    const hours = Math.floor(ms / 3600000) % 24;
    const minutes = Math.floor(ms / 60000) % 60;
    const seconds = Math.floor(ms / 1000) % 60;

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

// Command information
handler.help = ['runtime'];
handler.tags = ['main'];
handler.command = ['runtime', 'uptime'];
export default handler;
