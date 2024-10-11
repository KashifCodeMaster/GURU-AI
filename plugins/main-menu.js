import { promises as fs } from 'fs';
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
  header: '┏━❀•🎀 *%CATEGORY* 🎀•❀━┓',
  body: '◈ %cmd %isPremium %islimit',
  footer: '╚══•❅•°•❈•°•❅•══╝',
  after: '\n%me',
};

let handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
  await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

  try {
    /* Fetch user and global data */
    const glb = global.db.data.users;
    const tag = `@${m.sender.split('@')[0]}`;
    const mode = global.opts['self'] ? 'Private' : 'Public';
    const _package = JSON.parse(await fs.readFile(join(__dirname, '../package.json')).catch(() => '{}')) || {};
    const { age, exp, limit, level, role, credit } = glb[m.sender];
    const { min, xp, max } = xpRange(level, global.multiplier);
    const name = await conn.getName(m.sender);
    const premium = glb[m.sender].premiumTime > 0 ? 'Premium' : 'Free';
    const ucpn = ucapan();

    /* Uptime calculation */
    const _uptime = process.uptime() * 1000;
    const _muptime = process.send ? await new Promise(resolve => {
      process.send('uptime');
      process.once('message', resolve);
      setTimeout(resolve, 1000);
    }) * 1000 : _uptime;
    const muptime = clockString(_muptime);
    const uptime = clockString(_uptime);

    /* Gathering total features and help data */
    const totalfeatures = Object.values(global.plugins).filter(v => v.help && v.tags).length;
    const totalreg = Object.keys(glb).length;
    const help = Object.values(global.plugins)
      .filter(plugin => !plugin.disabled)
      .map(plugin => ({
        help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      }));
    const tags = [...new Set(help.flatMap(plugin => plugin.tags).filter(tag => tag))];

    /* Default menu structure */
    conn.menu = conn.menu || {};
    const before = conn.menu.before || defaultMenu.before;
    const header = conn.menu.header || defaultMenu.header;
    const body = conn.menu.body || defaultMenu.body;
    const footer = conn.menu.footer || defaultMenu.footer;
    const after = conn.menu.after || (conn.user.jid === global.conn.user.jid ? '' : `Powered by [CoolRobot](https://wa.me/${global.conn.user.jid.split`@`[0]})`) + defaultMenu.after;

    const text = [
      before,
      ...tags.map(tag => 
        header.replace(/%CATEGORY/g, (tag || 'Unknown Category').toUpperCase()) + '\n' + help
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

    /* Placeholder replacements */
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
      github: _package.homepage?.url || '[unknown github url]',
      tag,
      ucpn,
      platform: 'Digital Wonderland',
      mode,
      credit,
      age,
      name,
      prems: premium,
      level,
      limit,
      totalreg,
      totalfeatures,
      role,
      readmore: String.fromCharCode(8206).repeat(4001),
    };
    const caption = text.trim().replace(/%([%a-zA-Z]+)/g, (_, key) => replace[key] || '');

    /* Send the menu */
    await conn.sendMessage(m.chat, { video: { url: menuvid }, caption, gifPlayback: true, gifAttribution: 0 });

  } catch (e) {
    console.error(e);
    await conn.reply(m.chat, '😵 Oops! Something went wrong.', m);
  }
};

handler.command = /^(menu|help|\?)$/i;

export default handler;

/* Helper function for converting uptime to readable string */
function clockString(ms) {
  if (isNaN(ms)) return '--:--:--';
  const h = Math.floor(ms / 3600000);
  const m = Math.floor(ms / 60000 % 60);
  const s = Math.floor(ms / 1000 % 60);
  return [h, 'H', m, 'M', s, 'S'].map(v => v.toString().padStart(2, 0)).join(' ');
}

/* Greeting message based on time */
function ucapan() {
  const time = moment.tz('Asia/Karachi').format('HH');
  if (time >= 18) return '🌙 Good Night!';
  if (time >= 15) return '🌇 Good Afternoon!';
  if (time >= 11) return '🌞 Good Afternoon!';
  if (time >= 4) return '😎 Good Morning!';
  return '😄 Good Morning!';
      }
  
