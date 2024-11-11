let handler = async (m, { conn, text, participants, isAdmin, isOwner, groupMetadata }) => {
    // Filter out the bot's ID and gather user IDs for mentions
    let users = participants.map(u => u.id).filter(v => v !== conn.user.jid);

    // Start the message with a clean, bold group info header
    let message = `🔖 \`Group Notification\` 📌\n\n`;
    message += `📝 *Group Name*: ${groupMetadata.subject}\n`;
    message += `👥 *Total Members*: ${participants.length}\n`;
    message += `✪━━━━━━━━━━━━━✪\n\n`;  // Separator line

    // Add a personalized message from admin, or provide an engaging default prompt
    message += text
        ? `🔹 *Admin Message*:\n${text}\n\n`
        : `⚠️ *Reminder*:\nHey everyone! We’d love to see more activity here. So, you have been tagged because we want y'all to get active around here... Maybe it's time to stop lurking and say something, huh?\n\n`;
    
    message += `✪━━━━━━━━━━━━━✪\n\n`;  // Another separator for clarity

    // Mention all participants with a header
    message += `📢 *Tagged Members List* 👭\n`;
    message += users.map((user, index) => `🏅 *${index + 1}.* @${user.replace(/@.+/, '')}`).join("\n");
    message += `\n✪━━━━━━━━━━━━━✪\n\n`;  // Separator to close the list

    // Conclude with a friendly bot attribution footer
    message += `🔖 *Powered by ${global.botname}* \n\n`;

    // Send the message with mentions
    await conn.reply(m.chat, message, null, { mentions: users });
};

handler.help = ['tagall'];
handler.tags = ['group'];
handler.command = ['tagall'];
handler.admin = true;
handler.group = true;

export default handler;
