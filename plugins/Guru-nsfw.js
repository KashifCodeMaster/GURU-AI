import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command }) => {
  const groupChat = global.db.data.chats[m.chat];
  const userAge = global.db.data.users[m.sender].age;

  if (!groupChat.nsfw) {
    throw `🚫 Oh no! This group doesn't support NSFW content. You can enable it using *${usedPrefix}enable* nsfw`;
  }

  if (userAge < 17) {
    throw `❎ Oops! Access denied. This content is for mature souls, 18 and above.`;
  }

  m.reply(`⌛ Patience, young one. Fetching a hot ${command.toLowerCase()} image for you...`);

  try {
    const res = await fetch(`https://fantox-apis.vercel.app/${command}`);
    if (!res.ok) throw await res.text();

    const json = await res.json();
    if (!json.url) throw '❎ My bad! Couldn\'t find any spicy image in that category. Try another one.';

    conn.sendFile(m.chat, json.url, 'img.jpg', `✅ Voila! A steamy ${command.toLowerCase()} image, just for you!`, m);
    m.reply(`🔥 Careful, it's hot! Enjoy the spice responsibly!`);
    m.react(pickRandom(['😏', '😍', '🔥', '🥵', '👀', '😈']));
  } catch (error) {
    console.error(error);
    m.reply(`❎ Oops! Something went wrong while spicing up your experience.`);
    m.react('🥺');
  }
};

handler.help = ['genshin', 'swimsuit', 'schoolswimsuit', 'white', 'barefoot', 'touhou', 'gamecg', 'hololive', 'uncensored', 'sunglasses', 'glasses', 'weapon', 'shirtlift', 'chain', 'fingering', 'flatchest', 'torncloth', 'bondage', 'demon', 'wet', 'pantypull', 'headdress', 'headphone', 'tie', 'anusview', 'shorts', 'stokings', 'topless', 'beach', 'bunnygirl', 'bunnyear', 'idol', 'vampire', 'gun', 'maid', 'bra', 'nobra', 'bikini', 'whitehair', 'blonde', 'pinkhair', 'bed', 'ponytail', 'nude', 'dress', 'underwear', 'foxgirl', 'uniform', 'skirt', 'sex', 'sex2', 'sex3', 'breast', 'twintail', 'spreadpussy', 'tears', 'seethrough', 'breasthold', 'drunk', 'fateseries', 'spreadlegs', 'openshirt', 'headband', 'food', 'close', 'tree', 'nipples', 'erectnipples', 'horns', 'greenhair', 'wolfgirl', 'catgirl'];
handler.command = ['genshin', 'swimsuit', 'schoolswimsuit', 'white', 'barefoot', 'touhou', 'gamecg', 'hololive', 'uncensored', 'sunglasses', 'glasses', 'weapon', 'shirtlift', 'chain', 'fingering', 'flatchest', 'torncloth', 'bondage', 'demon', 'wet', 'pantypull', 'headdress', 'headphone', 'tie', 'anusview', 'shorts', 'stokings', 'topless', 'beach', 'bunnygirl', 'bunnyear', 'idol', 'vampire', 'gun', 'maid', 'bra', 'nobra', 'bikini', 'whitehair', 'blonde', 'pinkhair', 'bed', 'ponytail', 'nude', 'dress', 'underwear', 'foxgirl', 'uniform', 'skirt', 'sex', 'sex2', 'sex3', 'breast', 'twintail', 'spreadpussy', 'tears', 'seethrough', 'breasthold', 'drunk', 'fateseries', 'spreadlegs', 'openshirt', 'headband', 'food', 'close', 'tree', 'nipples', 'erectnipples', 'horns', 'greenhair', 'wolfgirl', 'catgirl'];
handler.tags = ['nsfw'];
handler.diamond = true;
handler.group = true;
handler.register = true;

export default handler;

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())];
}
