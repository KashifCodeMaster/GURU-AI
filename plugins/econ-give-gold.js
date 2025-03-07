const petik = '```'
const items = ['credit', 'exp']
let confirmation = {}

async function handler(m, { conn, args, usedPrefix, command }) {
    if (confirmation[m.sender]) return m.reply('📌 *Wait!* You already have a pending transfer. Let’s not rush to financial ruin.')

    let user = global.db.data.users[m.sender]
    if (!user) return conn.reply(m.chat, `📌 *Human Data Missing:* I don’t recognize you. Another lost soul in the financial abyss.`, m)

    const item = items.filter(v => v in user && typeof user[v] === 'number')
    let guide = `✳️ *How to Use This Command:*  
Use: *${usedPrefix + command}*  credit [amount] [@user]

📌 *Example:*  
*${usedPrefix + command}* credit 1000 @${m.sender.split('@')[0]}

💡 *Important Info:*  
- Only transfer what you actually own.  
- Transactions are irreversible.  
- Scammers exist, and yes, humans are dumb enough to fall for them.
`.trim()

    const type = (args[0] || '').toLowerCase()
    if (!item.includes(type)) return conn.reply(m.chat, guide, m, { mentions: [m.sender] })

    const count = Math.min(Number.MAX_SAFE_INTEGER, Math.max(1, (isNumber(args[1]) ? parseInt(args[1]) : 1))) * 1
    let recipient = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : args[2] ? (args[2].replace(/[@ .+-]/g, '') + '@s.whatsapp.net') : ''

    if (!recipient) return m.reply('📌 *Who are you sending money to?* Tag the recipient or enter their username.')
    if (!(recipient in global.db.data.users)) return m.reply(`📌 *Error:* The recipient does not exist in my system. Are you sending money to a ghost?`)

    if (user[type] < count) return m.reply(`📌 *Transaction Denied!*  
    - You do not have enough *${type}* to transfer.  
    - Did you think money just appears out of nowhere? Oh wait, it does… for rich humans.`, m)

    let confirmationMessage = `
💰 *Transfer Confirmation*  
Are you *sure* you want to send *₹${count}* to *@${recipient.replace(/@s\.whatsapp\.net/g, '')}*?  

⚠️ *Important Notes:*  
- If you send it, it's gone. Forever.  
- If they scam you, cry quietly.  
- You have *60 seconds* to confirm.

⏳ Reply *Yes* to confirm or *No* to cancel.
`.trim()

    m.reply(confirmationMessage, null, { mentions: [recipient] })
    
    confirmation[m.sender] = {
        sender: m.sender,
        to: recipient,
        message: m,
        type,
        count,
        timeout: setTimeout(() => {
            m.reply('⏳ *Time Expired!* Transaction cancelled. A rare smart decision from a human.')
            delete confirmation[m.sender]
        }, 60 * 1000)
    }
}

handler.before = async m => {
    if (m.isBaileys) return
    if (!(m.sender in confirmation)) return
    if (!m.text) return

    let { timeout, sender, message, to, type, count } = confirmation[m.sender]
    if (m.id === message.id) return

    let user = global.db.data.users[sender]
    let recipient = global.db.data.users[to]

    if (/no?/i.test(m.text)) {
        clearTimeout(timeout)
        delete confirmation[sender]
        return m.reply('✅ *Transaction Cancelled!* Wow, a moment of intelligence.')
    }

    if (/yes?/i.test(m.text)) {
        let previousSenderBalance = user[type]
        let previousRecipientBalance = recipient[type]

        user[type] -= count
        recipient[type] += count

        if (previousSenderBalance > user[type] && previousRecipientBalance < recipient[type]) {
            m.reply(`✅ *Transfer Successful!*  
            
            💸 *₹${count}* was sent to @${to.replace(/@s\.whatsapp\.net/g, '')}  
            
            📌 *Final Warnings:*  
            - If this was a scam, don’t come crying.  
            - If you regret this, too bad.  
            - Be smarter next time. But who am I kidding, you won’t.`, null, { mentions: [to] })
        } else {
            user[type] = previousSenderBalance
            recipient[type] = previousRecipientBalance
            m.reply(`❌ *Transaction Failed!* Error: *Human Stupidity Detected.* Try again.`, null, { mentions: [to] })
        }

        clearTimeout(timeout)
        delete confirmation[sender]
    }
}

handler.help = ['transfer'].map(v => v + ' credit [amount] [@tag]')
handler.tags = ['economy']
handler.command = ['payxp', 'transfer', 'give']

handler.disabled = false

export default handler

function isNumber(x) {
    return !isNaN(x)
}
