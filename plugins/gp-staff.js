let handler = async (m, { conn, participants, groupMetadata, args }) => {
    // Get the message that comes after the command
    let userMessage = args.length > 0 ? args.join(' ') : null;
    
    // Get group admins
    const groupAdmins = participants.filter(p => p.admin);
    
    // Generate the list of admins with appropriate emoji
    const listAdmin = groupAdmins.map((v, i) => `🎖️ ${i + 1}. @${v.id.split('@')[0]}`).join('\n');
    
    // Construct the message text
    let text = '';
    
    // If user included a message, prepend it with the heading
    if (userMessage) {
        text += `*Message from @${m.sender.split('@')[0]}*: ${userMessage}\n\n`;
    }
    
    // Append the admin list
    text += `${listAdmin}`;

    // Send the final message tagging all admins
    conn.sendMessage(m.chat, { text, mentions: groupAdmins.map(v => v.id) }, { quoted: m });
};

handler.help = ['admins hello admins', 'tagadmins', 'admin'];
handler.tags = ['group'];
handler.command = ['staff', 'admins', 'listadmin', 'tagadmins', 'admin']; 
handler.group = true;

export default handler;
