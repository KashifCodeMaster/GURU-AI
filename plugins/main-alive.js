let handler = async (m, { conn }) => {
    let uptime = process.uptime();
    let name = "Silver Fox";

    let days = Math.floor(uptime / 86400);
    let hours = Math.floor(uptime / 3600) % 24;
    let minutes = Math.floor(uptime / 60) % 60;

    let greetings = [
        `Greetings, ${m.mentionedJid[0]}! 🌟`,
        `Hello there, ${m.mentionedJid[0]}! 🦊`,
        `Ahoy, ${m.mentionedJid[0]}! 🚀`,
        `Salutations, ${m.mentionedJid[0]}! 🌈`,
        `Hey, ${m.mentionedJid[0]}! Welcome to the fox den! 🌟`,
        `Greetings, ${m.mentionedJid[0]}! 🌌`,
        `Well met, ${m.mentionedJid[0]}! 🌍`,
        `Hello, ${m.mentionedJid[0]}! 🧠`,
        `Greetings, ${m.mentionedJid[0]}! 🌟`
    ];

    let randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

    let message = `${randomGreeting} I am ${name}, the Silver Fox. 🦊\nI'm delighted to confirm that I am alive, well, and at your service. 🐶\n\n⌛ *I've been actively functioning for* ${days} days, ${hours} hours, ${minutes} minutes\n\nYour interaction keeps my circuits buzzing with joy! 😁`;

    let additionalInfo = '';
    if (Math.random() > 0.5) {
        additionalInfo += `\n\n🌟 *Fun Fact:* Foxes are known for their adaptability in different environments. Just like me adapting to your needs! 🥹🦊`;
    } else {
        additionalInfo += `\n\nIn the vast digital space, I'm like a friendly fox guiding you through the virtual wilderness! 🥹🦊`;
    }
    message += additionalInfo;

    m.react('🦊');

    conn.sendMessage(m.chat, {
        text: message,
        mentions: [m.sender],
        contextInfo: {
            externalAdReply: {
                showAdAttribution: true
            },
            isForwarded: true,
            forwardingScore: 999
        }
    });
}

handler.help = ['alive']
handler.tags = ['main']
handler.command = /^(alive)$/i 

export default handler;
