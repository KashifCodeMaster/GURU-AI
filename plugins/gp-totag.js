let handler = async (m, { conn, text, participants, isAdmin, isOwner }) => {
    
    let users = participants.map(u => u.id).filter(v => v !== conn.user.jid)
    if (!m.quoted) throw `✳️ Reply to a message`
    
    // Allow the bot itself to run the command without checking admin rights
    if (m.sender === conn.user.jid || isAdmin || isOwner) {
        conn.sendMessage(m.chat, { forward: m.quoted.fakeObj, mentions: users })
    } else {
        throw `🚫 Only *admins* can use this command!`
    }
}

handler.help = ['totag']
handler.tags = ['group']
handler.command = /^(totag|tag)$/i

handler.admin = false // Remove forced admin check; we handle it manually
handler.group = true

export default handler
