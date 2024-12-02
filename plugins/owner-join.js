let handler = async (m, { conn, text, usedPrefix, command, args, participants, isOwner }) => {
    // React with an emoji to acknowledge the command
    await m.react("💌");

    // Check if a link was provided in the command
    if (!args[0]) {
        throw `✳️ Where's the link? Please send the group link.\n\n📌 Example:\n *${usedPrefix + command}* <linkwa>`;
    }

    // Validate the provided link
    const linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i;
    let [_, code] = args[0].match(linkRegex) || [];
    if (!code) {
        throw `✳️ Invalid link. Please ensure you’re providing a valid WhatsApp group link.`;
    }

    // If the user is not the owner, send a polite response and exit
    if (!isOwner) {
        return conn.sendMessage(
            m.chat,
            {
                text: `Hello @${m.sender.split('@')[0]}, thanks for inviting me! 🎉\n\nYour request has been received and will be processed soon. It may take 3–5 days to complete, so please be patient.\n\nIn the meantime, if you have any queries, you can send us a message.`.trim(),
            },
            { quoted: m }
        );
    }

    // Inform the user about the join attempt
    await m.reply(`😎 Joining the group in 3 seconds...`);
    await new Promise((res) => setTimeout(res, 3000));

    try {
        // Try to join the group with the invite code
        let groupId = await conn.groupAcceptInvite(code);
        let groupName = await conn.getName(groupId);

        // Funny welcome message on successful join
        await conn.sendMessage(
            groupId,
            `Ladies and Gentlemen, brace yourselves... the Robot has officially joined the group! 🎉\n\n*Hello, humans!* Be prepared, this chat just got a serious upgrade!`,
            { mentions: participants }
        );

        // Pause before sending the warning message to build suspense
        await new Promise((res) => setTimeout(res, 7000));

        // Send a warning about rules if the bot is an admin
        await conn.sendMessage(
            groupId,
            `And one more thing... from now on, no links, no spam, and watch your language. Violators will be removed faster than you can say "Oops!" But this only applies if you make me an admin... otherwise, eventually, I might have to leave this group. \n\nSo, heads up, admins! Grant me admin status so I can assist better, or… well, let’s just say I don’t stick around where I’m not appreciated. 😉 `,
            { mentions: participants }
        );

    } catch (error) {
        // Notify the owner if joining fails
        conn.reply(global.owner[1] + '@s.whatsapp.net', error);
        throw `✳️ Sorry, the bot couldn't join the group.`;
    }
};

// Command metadata and permissions
handler.help = ['join <chat.whatsapp.com>'];
handler.tags = ['owner'];
handler.command = ['join', 'invite'];
// handler.owner = true

export default handler;
