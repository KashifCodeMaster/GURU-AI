let handler = m => m
handler.before = async function (m) {
  if (!/^-?[0-9]+(\.[0-9]+)?$/.test(m.text)) return !0
  let id = m.chat

  if (!m.quoted || !m.quoted.fromMe || !m.text || !/^🤖 \*Alright, you primitive ape/i.test(m.quoted.text))
    return !0

  this.math = this.math || {}
  if (!(id in this.math)) return this.reply(m.chat, '🛑 *The game is over, you useless lump of carbon.*', m)

  if (m.quoted.id == this.math[id][0].id) {
    let math = JSON.parse(JSON.stringify(this.math[id][1]))

    if (m.text == math.result) {
      global.db.data.users[m.sender].exp += math.bonus
      clearTimeout(this.math[id][3])
      delete this.math[id]
      m.reply(`✅ *Well, well, well... you actually got it right.*  
      
      🎁 *You earned:* *+${math.bonus} XP*  
      *Don’t get too excited, though. Even a broken clock is right twice a day.*`)
    } else {
      if (--this.math[id][2] == 0) {
        clearTimeout(this.math[id][3])
        delete this.math[id]
        m.reply(`❌ *Wow, you've run out of chances. I'm shocked. Truly.*  

        *The correct answer was:* *${math.result}*  
        
        *Maybe next time, try not being terrible at everything.*`)
      } else {
        m.reply(`❎ *Wrong. Again. What a surprise.*  
        
        *You have ${this.math[id][2]} chances left before I delete you from existence.*`)
      }
    }
  }
  return !0
}

export default handler
