import { promises } from 'fs';
import { join } from 'path';
import { xpRange } from '../lib/levelling.js';
import moment from 'moment-timezone';

const defaultMenu = {
  before: `
Hello %tag,
%ucpn

🤖 *${botname} at Your Service!*

┏━━༻ *USER STATS* ༺━━┓
⚔️ *Name:* %name
💰 *Gold:* %credit
🎭 *Role:* %role
📈 *Level:* %level [ %xp4levelup XP to Level Up]
🌟 *XP:* %exp / %maxexp
🌌 *Total XP:* %totalexp
╰──────────⳹

┏━━༻ *ROBOT INFO* ༺━━┓
⚙️ *Robot Name:* ${botname}
⚓ *Command Prefix:* *%_p*
🚀 *Operation Mode:* %mode
⏰ *Uptime:* %muptime
💾 *Database:*  %totalreg
╰──────────⳹

┏༻ *COMMAND CENTER* ༺┓
│ *%totalfeatures* Commands
╰──────────⳹
%readmore
`.trimStart(),
  header: '┏━❀•🎀 *%category* 🎀•❀━┓',
  body: '◈ %cmd %isPremium %islimit',
  footer: '╚══•❅•°•❈•°•❅•══╝',
  after: '\n%me',
};

let handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
  await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

  try {
    /* Info Menu */
    const glb = global.db.data.users;
    const tag = `@${m.sender.split('@')[0]}`;
    const mode = global.opts['self'] ? 'Private' : 'Public';
    const _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {};
    const { age, exp, limit, level, role, credit } = glb[m.sender];
    const { min, xp, max } = xpRange(level, global.multiplier);
    const name = await conn.getName(m.sender);
    const premium = glb[m.sender].premiumTime;
    const prems = `${premium > 0 ? 'Premium' : 'Free'}`;
    const ucpn = ucapan();

    const _uptime = process.uptime() * 1000;
    const _muptime = process.send ? await new Promise(resolve => {
      process.send('uptime');
      process.once('message', resolve);
      setTimeout(resolve, 1000);
    }) * 1000 : _uptime;
    const muptime = clockString(_muptime);
    const uptime = clockString(_uptime);

    const totalfeatures = Object.values(global.plugins).filter(v => v.help && v.tags).length;
    const totalreg = Object.keys(glb).length;
    const help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => ({
      help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
      tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
      prefix: 'customPrefix' in plugin,
      limit: plugin.limit,
      premium: plugin.premium,
      enabled: !plugin.disabled,
    }));
    const tags = [...new Set(help.flatMap(plugin => plugin.tags))];
    conn.menu = conn.menu || {};
    const before = conn.menu.before || defaultMenu.before;
    const header = conn.menu.header || defaultMenu.header;
    const body = conn.menu.body || defaultMenu.body;
    const footer = conn.menu.footer || defaultMenu.footer;
    const after = conn.menu.after || (conn.user.jid == global.conn.user.jid ? '' : `Powered by [CoolRobot](https://wa.me/${global.conn.user.jid.split`@`[0]})`) + defaultMenu.after;
    const text = [
      before,
      ...tags.map(tag => header.replace(/%category/g, tag.toUpperCase()) + '\n' + help
        .filter(menu => menu.tags && menu.tags.includes(tag) && menu.help)
        .map(menu => menu.help
          .map(help => body
            .replace(/%cmd/g, menu.prefix ? help : `%_p${help}`)
            .replace(/%islimit/g, menu.limit ? 'Ⓛ' : '')
            .replace(/%isPremium/g, menu.premium ? '🅟' : '')
            .trim()
          ).join('\n')
        ).join('\n') + footer
      ),
      after,
    ].join('\n\n');
    const replace = {
      '%': '%',
      p: _p,
      uptime,
      muptime,
      me: conn.getName(conn.user.jid),
      npmname: _package.name,
      npmdesc: _package.description,
      version: _package.version,
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp,
      github: _package.homepage ? _package.homepage.url || _package.homepage : '[unknown github url]',
      tag,
      ucpn,
      platform: 'Digital Wonderland',
      mode,
      _p,
      credit,
      age,
      name,
      prems,
      level,
      limit,
      totalreg,
      totalfeatures,
      role,
      readmore: String.fromCharCode(8206).repeat(4001),
    };
    const caption = text.trim().replace(/%([%puptimecrdname]+)/g, (_, name) => replace[name]);
    
conn.sendMessage(
  m.chat,
  { video: { url: menuvid }, caption, gifPlayback: true, gifAttribution: 0 },
  { quoted: contact, contextInfo: { mentionedJid: [m.sender] } }
);
    
  } catch (e) {
    console.error(e);
    await conn.reply(m.chat, '😵 Oops! Something went wrong.', m);
    throw e;
  }
};
handler.command = /^(menu|help|\?)$/i;

export default handler;

function clockString(ms) {
  if (isNaN(ms)) return Array(6).fill('--').map(v => v.padStart(2, 0)).join(' ');
  const [h, m, s] = [ms / 3600000, ms / 60000 % 60, ms / 1000 % 60].map(v => Math.floor(v));
  return [h, 'H', m, 'M', s, 'S'].map(v => v.toString().padStart(2, 0)).join(' ');
}

function ucapan() {
  const time = moment.tz('Asia/Karachi').format('HH');
  if (time >= 18) return '🌙 Good Night!';
  if (time >= 15) return '🌇 Good Afternoon!';
  if (time >= 11) return '🌞 Good Afternoon!';
  if (time >= 4) return '😎 Good Morning!';
  return '😄 Good morning!';
      }
      
