let handler = async (m, { conn }) => {
    let uptime = process.uptime();
    let name = "Silver Fox";

    let days = Math.floor(uptime / 86400);
    let hours = Math.floor(uptime / 3600) % 24;
    let minutes = Math.floor(uptime / 60) % 60;

    let greetings = [
        `Greetings, @${m.sender.split('@')[0]}! 🐶`,
        `Hello there, @${m.sender.split('@')[0]}! 🐶`,
        `Ahoy, @${m.sender.split('@')[0]}! 🐶`,
        `Salutations, @${m.sender.split('@')[0]}! 🐶`,
        `Hey, @${m.sender.split('@')[0]}! 🐶`,
        `Greetings, @${m.sender.split('@')[0]}! 🐶`,
        `Well met, @${m.sender.split('@')[0]}! 🐶`,
        `Hello, @${m.sender.split('@')[0]}! 🧠`,
        `Greetings, @${m.sender.split('@')[0]}! 🐶`
    ];

    let randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

    let message = `${randomGreeting} I am ${name}, the Silver Fox. 🦊\nI'm delighted to confirm that I am alive, well, and at your service. 🤖\n\n👩🏻‍🏭 *I've been actively functioning for* ${days} days, ${hours} hours, ${minutes} minutes\n\nYour interaction keeps my circuits buzzing with joy! 😁`;

    m.react('🦊');

    conn.sendMessage(m.chat, {
        text: message,
        mentions: [m.sender],
        contextInfo: {
            mentionedJid: [m.sender],
            isForwarded: true,
            forwardingScore: 999
        }
    });
}

handler.help = ['alive']
handler.tags = ['main']
handler.command = /^(alive)$/i 

export default handler;
