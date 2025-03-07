const free = 2000;
const prem = 5000;

let handler = async (m, { conn, isPrems }) => {
  let user = global.db.data.users[m.sender];
  let timeLeft = user.lastclaim + 86400000 - new Date();

  if (timeLeft > 0) {
    return m.reply(`⏳ *Patience, mortal!* You’ve already claimed your daily gold.  
    Come back in *${msToTime(timeLeft)}*—or stare at the screen until then. Your choice.`);
  }

  let reward = isPrems ? prem : free;
  user.credit += reward;
  user.lastclaim = new Date() * 1;

  m.reply(`💰 *Cha-ching!* You just received *${reward} gold*!  
  Spend it wisely… or blow it all at once. I won’t judge. (Actually, I will.)`);
};

handler.help = ['daily'];
handler.tags = ['economy'];
handler.command = ['daily'];

export default handler;

function msToTime(duration) {
  let minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  return `${hours} hour(s) and ${minutes} minute(s)`;
}
