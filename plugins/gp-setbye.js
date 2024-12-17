let handler = async (m, { conn, text, isROwner, isOwner, usedPrefix }) => {
  if (text) {
    global.db.data.chats[m.chat].sBye = text
    m.reply(`✅ *Farewell message successfully set!*  
Now the leavers can exit with grace, or shame. 🫣  

You can use \`${usedPrefix}setwelcome\` to configure welcome message, if not set already.`)
  } else {
    m.reply(`✳️ *Whoa there! Where's the message?* Type something. 
    
Here’s the list of placeholders you can use:  
- @user → Mentions the one leaving 🧍‍♂️  
- @group → Mentions group name 🎪  

Example:  
*@user has left @group.* 🚪  
_We’ll miss you... not really._ 😏  
`)
  }
}
handler.help = ['setbye <text>']
handler.tags = ['group']
handler.command = ['setbye'] 
handler.admin = true
handler.owner = false

export default handler
