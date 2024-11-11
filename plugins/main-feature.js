import fs from 'fs'
import fetch from 'node-fetch'
import moment from 'moment-timezone'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Identify the sender or mentioned user
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    let name = await conn.getName(who)

    // Get the total number of features in the robot
    let totalf = Object.values(global.plugins).filter((v) => v.help && v.tags).length

    // Format the response message
    let txt = `*🤖  ROBOT FEATURE SUMMARY* 🤖\n\n`
    txt += `  ◦  *Total Features Available*: ${totalf}\n`
    txt += `  ◦  *Requested By*: @${name}\n`
    txt += `\n*Use these features wisely, or face the robot’s cold metal wrath 😜*`

    // Prepare the message to send, including a "currency" for fun
    await conn.relayMessage(m.chat, {
        requestPaymentMessage: {
            currencyCodeIso4217: 'USD',
            amount1000: totalf * 1000, // Just a fun "price" for all features
            requestFrom: '0@s.whatsapp.net',
            noteMessage: {
                extendedTextMessage: {
                    text: txt,
                    contextInfo: {
                        mentionedJid: [m.sender], // Mention the sender
                        externalAdReply: {
                            showAdAttribution: true // Display attribution if needed
                        }
                    }
                }
            }
        }
    }, {})
}

handler.help = ['totalfeature']
handler.tags = ['main']
handler.command = /^(feature|totalfeature)$/i

export default handler
