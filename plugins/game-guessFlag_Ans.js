import similarity from 'similarity';

const threshold = 0.72;

export async function before(m) {
    let id = m.chat;

    // Check if there's an active game in this chat
    if (!this.tebakbendera || !(id in this.tebakbendera)) return;

    let game = this.tebakbendera[id];
    let json = game[1];

    // Ensure message is relevant to the game
    if (!m.text || !json.name) return;

    let answer = json.name.toLowerCase().trim();
    let userAnswer = m.text.toLowerCase().trim();

    // Check if user surrendered
    if (/^(me)?nyerah|surr?ender$/i.test(userAnswer)) {
        clearTimeout(game[3]);
        delete this.tebakbendera[id];
        return this.reply(
            m.chat, 
            `😆 *Pathetic!*  
So, you finally admit your inferior brain couldn't handle it?  
📢 *The correct answer was:* *${json.name}*  
Better luck next time, human... or should I say, lower life form.`,
            m
        );
    }

    // Check if the answer is correct
    if (userAnswer === answer) {
        global.db.data.users[m.sender].exp += game[2]; // Give XP reward
        this.reply(
            m.chat, 
            `🎉 *UNBELIEVABLE!*  
Did you actually manage to get it right, or was that just a lucky guess?  
✅ *Correct Answer:* *${json.name}*  
🎁 *You somehow earned:* ${game[2]} XP  
Maybe there’s hope for your species after all… but I doubt it.`,
            m
        );
        clearTimeout(game[3]);
        delete this.tebakbendera[id];
    } else if (similarity(userAnswer, answer) >= threshold) {
        m.reply(
            `⚠️ *Almost... but not quite!*  
You're so close, yet so far. Come on, use that tiny brain of yours!  
Try again before time runs out.`
        );
    } else {
        this.reply(
            m.chat, 
            `❌ *WRONG!*  
Oh dear, another incorrect answer. I expected nothing more from a human like you.  
Are you even *trying*, or just smashing your keyboard in despair?  
Think harder—or don't. Your failure amuses me.`,
            m
        );
    }
}

export const exp = 0;
