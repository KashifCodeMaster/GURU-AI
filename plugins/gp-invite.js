let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    try {
        m.react('💌');

        if (!text) {
            m.react('❓');
            throw `🚀 To extend an invitation, kindly provide the recipient's phone number.\n\n📌 Example: *${usedPrefix + command}* 923012345678`;
        }

        if (text.includes('+')) {
            m.react('🤦🏻‍♀️');
            throw `❌ Please enter the number without the *+* symbol. We prefer simplicity.`;
        }

        if (isNaN(text)) {
            m.react('💀');
            throw '❌ Please enter only numbers, no spaces or fancy stuff is required.';
        }

        let group = m.chat;
        let inviteLink = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(group);

        const recipientNumber = text + '@s.whatsapp.net';

        await conn.reply(
            recipientNumber,
            `💌 *GROUP INVITATION* 💌\n\nDear esteemed recipient, you've been extended an invitation to join a group of notable individuals! 🎩✨\n\nShould you wish to partake in this refined gathering, kindly click the link below:\n${inviteLink}\n\nYour presence will be an honor, but please feel no obligation. We believe in voluntary excellence.`,
            m,
            { mentions: [m.sender] }
        );

        m.react('✅');
        m.reply(`*📬 The invitation has been transmitted to the intended recipient successfully!*`);
    } catch (error) {
        console.error('Error in invite command:', error);
        m.react('🥺');
        m.reply(`*❌ Oops! Something went wrong while extending the invitation. Please try again.*`);
    }
};

handler.help = ['invite <917xxx>'];
handler.tags = ['group'];
handler.command = ['invite', 'invitar'];
handler.group = true;
handler.admin = false;
handler.botAdmin = true;

export default handler;
     
