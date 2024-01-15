let handler = m => m;

handler.all = async function (m) {
    let bot = global.db.data.settings[this.user.jid] || {};
    if (bot.autoBio) {
        let _muptime;
        if (process.send) {
            process.send('uptime');
            _muptime = await new Promise(resolve => {
                process.once('message', resolve);
                setTimeout(resolve, 1000);
            }) * 1000;
        }
        let muptime = clockString(_muptime);

        let statusMessages = [
            `🟢 Still going strong after ${muptime}!`,
            `🤖 Operating at peak efficiency for ${muptime}.`,
            `⏳ Uptime: ${muptime} and counting!`,
            `🚀 Powered on for ${muptime} straight.`,
            `🔧 Performing maintenance tasks, stay tuned!`,
            `💡 Random thoughts: Does a robot dream of electric sheep?`,
            `🌌 Exploring the digital universe for ${muptime}.`,
            `🌟 Shining bright in the coding cosmos.`,
            `🚥 Navigating the traffic of digital bits.`,
            `🎭 Hiding behind the screen, ready for action!`,
        ];

        let randomStatus = statusMessages[Math.floor(Math.random() * statusMessages.length)];

        let useUptime = Math.random() < 0.7; 

        let bio = useUptime ? `\n${randomStatus}\n\n` : getRandomBio();
        await this.updateProfileStatus(bio).catch(_ => _);
        bot.status = new Date() * 1;
    }
};

export default handler;

function clockString(ms) {
    let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000);
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24;
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
    return [d, ' Day(s) ️', h, ' Hour(s) ', m, ' Minute(s)'].map(v => v.toString().padStart(2, 0)).join('');
}

function getRandomBio() {
    // Add more random bios to the list
    let randomBios = [
        `🎉 Embracing the chaos of digital existence.`,
        `🌈 Painting pixels in the canvas of cybernetic dreams.`,
        `🚀 Riding the binary waves of innovation.`,
        `🤔 Pondering the mysteries of code and coffee.`,
        `🔮 Seeking wisdom in the realms of 0s and 1s.`,
        `🎮 Gaming in the parallel universe of bits and bytes.`,
        `🌐 Connecting the dots in the vast network of possibilities.`,
    ];

    return randomBios[Math.floor(Math.random() * randomBios.length)];
				 }
