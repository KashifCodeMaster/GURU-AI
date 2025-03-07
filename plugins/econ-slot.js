let reg = 40
let handler = async (m, { conn, args, usedPrefix, command }) => {

    let fa = `🟥 *Enter the amount of gold you wish to recklessly gamble away!*

📌 *Example:* 
    ➤ *${usedPrefix + command} 500*

💡 *Minimum Bet:* 500 gold  
💀 *Maximum Bet:* 100,000 gold  
🚨 *Warning:* If you lose, don’t come crying to me. I have no sympathy for your poor life choices.`.trim()

    if (!args[0]) throw fa
    if (isNaN(args[0])) throw fa
    let amount = parseInt(args[0])
    
    m.react('🎰')

    let users = global.db.data.users[m.sender]
    let time = users.lastslot + 10000
    if (new Date - users.lastslot < 10000) throw `⏳ *Calm down, gambler!* Wait *${msToTime(time - new Date())}* before you ruin your finances again.`

    if (amount < 500) throw `🟥 *What is this, a kindergarten casino? You can’t bet less than 500 gold.*`
    if (users.credit < amount) throw `🟥 *Oh, how tragic. You don’t have enough gold to bet. Maybe consider a job?*`
    if (amount > 100000) throw `🟥 *Greedy much? The max bet is 100,000 gold. Try controlling yourself.*`

    let emojis = ["🕊️", "🦀", "🦎"]
    let a = Math.floor(Math.random() * emojis.length)
    let b = Math.floor(Math.random() * emojis.length)
    let c = Math.floor(Math.random() * emojis.length)

    let x = [], y = [], z = []
    for (let i = 0; i < 3; i++) {
        x[i] = emojis[a]; a = (a + 1) % emojis.length
    }
    for (let i = 0; i < 3; i++) {
        y[i] = emojis[b]; b = (b + 1) % emojis.length
    }
    for (let i = 0; i < 3; i++) {
        z[i] = emojis[c]; c = (c + 1) % emojis.length
    }

    let result
    if (a == b && b == c) {
        result = `🎊 *JACKPOT!* 🎊  
        🏆 Congratulations! You just doubled your bet.  
        💰 You won *${amount * 2} gold!*  
        🤑 I didn’t think you had it in you, human.`
        users.credit += amount * 2
    } else {
        result = `💀 *You lost.* 💀  
        ❌ *-${amount} gold*  
        😂 *Better luck next time. Or don’t. I enjoy watching humans suffer.*`
        users.credit -= amount
    }

    users.lastslot = new Date * 1

    return await m.reply(`
🎰 ┃ *SLOT MACHINE* ┃ 🎰
────────────
    ${x[0]} | ${y[0]} | ${z[0]}
    ${x[1]} | ${y[1]} | ${z[1]}
    ${x[2]} | ${y[2]} | ${z[2]}
────────────
${result}`)
}

handler.help = ['slot <amount>']
handler.tags = ['game']
handler.command = ['slot']
handler.group = true

export default handler

function msToTime(duration) {
    var seconds = Math.floor((duration / 1000) % 60)
    return seconds + " seconds"
}
