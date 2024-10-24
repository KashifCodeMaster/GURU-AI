let handler = async (m, { conn, participants, groupMetadata, args }) => {
    // Get the message that comes after the command
    let userMessage = args.length > 0 ? args.join(' ') : null;

    // Get group admins
    const groupAdmins = participants.filter(p => p.admin);
    
    // Generate the list of admins with appropriate emoji (no numbering)
    const listAdmin = groupAdmins.map(v => `🎖️ @${v.id.split('@')[0]}`).join('\n');

    // Construct the message text
    let text = '';

    // If user included a message, prepend it with the heading and mention the user
    if (userMessage) {
        text += `*Message from @${m.sender.split('@')[0]}*: ${userMessage}\n\n`;
    }

    // Append the admin list
    text += `${listAdmin}`;

    // Create a mentions array to tag both the user and the admins
    let mentions = [m.sender, ...groupAdmins.map(v => v.id)];

    // Send the final message tagging all admins and the user
    conn.sendMessage(m.chat, { text, mentions }, { quoted: m });
};

handler.help = ['admins hello', 'tagadmins', 'admin'];
handler.tags = ['group'];
handler.command = ['staff', 'admins', 'listadmin', 'tagadmins', 'admin']; 
handler.group = true;

export default handler;
