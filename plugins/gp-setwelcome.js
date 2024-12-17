let handler = async (m, { conn, text, isROwner, isOwner, usedPrefix }) => {
  if (text) {
    global.db.data.chats[m.chat].sWelcome = text
    m.reply(`✅ *Welcome message successfully set!*  
Great choice! Now new members can awkwardly be welcomed.  

Need to show them the door too?  
Try \`${usedPrefix}setbye\` and let them leave with style! 🚪👋`)
  } else {
    m.reply(`✳️ *Hold up, genius! Where's the welcome message?*  
You can't set an empty welcome message, come on!  

Here are the placeholders you can use:  
- @user → Mentions the poor soul who just joined 🧍‍♂️  
- @group → The glorious group name 🎪  
- @desc → Your group's description 📜  

Example:  
*Welcome @user to @group!* 🎉  
`)
  }
}
handler.help = ['setwelcome <text>']
handler.tags = ['group']
handler.command = ['setwelcome'] 
handler.admin = true
handler.owner = false

export default handler
