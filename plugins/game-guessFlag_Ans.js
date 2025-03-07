import similarity from 'similarity';

const threshold = 0.72;

export async function before(m) {
    let id = m.chat;

    if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !m.text || !/Use.*fhint/i.test(m.quoted.text))
        return true;

    this.tebakbendera = this.tebakbendera || {};
    if (!(id in this.tebakbendera)) 
        return this.reply(m.chat, '⚠️ *The game is already over, you slow-witted lifeform.*', m);

    if (m.quoted.id == this.tebakbendera[id][0].id) {
        let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text);
        
        if (isSurrender) {
            clearTimeout(this.tebakbendera[id][3]);
            delete this.tebakbendera[id];
            return this.reply(m.chat, '😆 *Pathetic! You gave up!*', m);
        }

        let json = this.tebakbendera[id][1];

        if (m.text.toLowerCase().trim() === json.name.toLowerCase().trim()) {
            global.db.data.users[m.sender].exp += this.tebakbendera[id][2];
            this.reply(m.chat, `✅ *Correct!*  
🎉 *You actually got it right? Miraculous.*  
🎁 *+${this.tebakbendera[id][2]} XP*`, m);

            clearTimeout(this.tebakbendera[id][3]);
            delete this.tebakbendera[id];
        } else if (similarity(m.text.toLowerCase().trim(), json.name.toLowerCase().trim()) >= threshold) {
            m.reply(`❗ *Close, but not quite. Try again, human.*`);
        } else {
            this.reply(m.chat, `❌ *Wrong! Hah!*`, m);
        }
    }
    return true;
}
export const exp = 0;
