let handler = async (m, { conn, text, participants, isAdmin, isOwner, groupMetadata }) => {
    let users = participants.map(u => u.id).filter(v => v !== conn.user.jid)

    // Construct the message with visual appeal, numbering, and emoji
    let txt = `🌟 *Group*: *${groupMetadata.subject}*\n`
    txt += `👥 *Members*: *${participants.length}*\n`
    if (text) txt += `💬 *Message*: ${text}\n`
    txt += `\n*┌───⊷*  *MENTIONS*  *⊶───┐*\n`

    // Add numbered mentions with emojis (🏅 for member mention)
    txt += users.map((v, i) => `🏅 *${i + 1}* @${v.replace(/@.+/, '')}`).join("\n")

    // Add a funny, sarcastic, and context-aware fallback message if no text is provided
    if (!text) {
        txt = `⚡ *You’ve been tagged because we want y’all to get active around here... Maybe it's time to stop lurking and say something, huh?* ⚡\n` + txt
    }

    // Add a funny powered by message with the bot's name
    txt += `\n└──✪ Powered by ${global.botname} ──✪──`

    // Send the message with mentions
    await conn.reply(m.chat, txt, null, { mentions: users })
}

handler.help = ['tagall']
handler.tags = ['group']
handler.command = ['tagall']
handler.admin = true
handler.group = true

export default handler
