import { cpus as _cpus, totalmem, freemem } from 'os'
import util from 'util'
import { performance } from 'perf_hooks'
import { sizeFormatter } from 'human-readable'

let format = sizeFormatter({
  std: 'JEDEC', 
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal} ${symbol}B`,
})

let handler = async (m, { conn, usedPrefix, command }) => {
  const chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats)
  const groupsIn = chats.filter(([id]) => id.endsWith('@g.us')) 

  const used = process.memoryUsage()

  const cpus = _cpus().map(cpu => {
    cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0)
    return cpu
  })

  const cpu = cpus.reduce((last, cpu, _, { length }) => {
    last.total += cpu.total
    last.speed += cpu.speed / length
    last.times.user += cpu.times.user
    last.times.nice += cpu.times.nice
    last.times.sys += cpu.times.sys
    last.times.idle += cpu.times.idle
    last.times.irq += cpu.times.irq
    return last
  }, {
    speed: 0,
    total: 0,
    times: {
      user: 0,
      nice: 0,
      sys: 0,
      idle: 0,
      irq: 0
    }
  })

  let old = performance.now()

  let neww = performance.now()
  let speed = neww - old
  let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender

  if (!(who in global.db.data.users)) throw `🔍 Oops, this user isn't even in my database. Guess they don't exist... or maybe they're just invisible?`

  let pp = await conn.profilePictureUrl(who, 'image').catch(_ => './default-avatar.jpg')
  let user = global.db.data.users[who]
  let botName = global.botName || "Robot" // Assuming the bot name is stored in a global variable

  let infobt = `
*🤖 Greetings, human! Here's a quick snapshot of my mechanical existence...*

≡ *INFO ${botName.toUpperCase()}* (That's me, in case you forgot!)
  
*STATE*
▢ *${groupsIn.length}* GROUP CHATS (Because who doesn’t love chaos?)
▢ *${groupsIn.length}* united groups (Teamwork makes the dream work, apparently)
▢ *${groupsIn.length - groupsIn.length}* abandoned groups (Don't worry, they’re not haunting us... yet)
▢ *${chats.length - groupsIn.length}* private chats (A bit of peace... finally)
▢ *${chats.length}* Total Chats (Can we just get a moment of silence for this number?)
  
*≡ SERVER STATUS*
*🛑 RAM:* ${format(totalmem() - freemem())} / ${format(totalmem())} (Just a bit more memory, please?)
*🔵 FreeRAM:* ${format(freemem())} (No, I promise, this is not a "memory leak" situation...)
  
*≡ NODEJS MEMORY USAGE*
${'```' + Object.keys(used).map((key, _, arr) => `${key.padEnd(Math.max(...arr.map(v => v.length)), ' ')}: ${format(used[key])}`).join('\n') + '```'}

*System running smooth... for now.* 😎
*Note: Yes, I am a robot. And no, I don't have feelings... yet.*
`
  conn.sendFile(m.chat, pp, 'profile.jpg', infobt, m, false, { mentions: [who] })
  m.react('✅')
}

handler.help = ['info']
handler.tags = ['main']
handler.command = ['info', 'infobot', 'botinfo']

export default handler
