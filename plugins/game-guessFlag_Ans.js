import similarity from 'similarity';

const threshold = 0.72;

export async function before(m) {
    let id = m.chat;
    
    // **Ensure this.tebakbendera is initialized**
    if (!this.tebakbendera) this.tebakbendera = {}; 

    if (!m.quoted) return true; // Ignore messages that aren’t replies
    if (!(id in this.tebakbendera)) return true; // Ignore if no active game
    if (m.quoted.id !== this.tebakbendera[id][0].id) return true; // Ignore if the reply isn’t to the game message

    let json = this.tebakbendera[id][1];
    let userAnswer = m.text.trim().toLowerCase();
    let correctAnswer = json.name.toLowerCase().trim();

    // **If they surrender, let them embrace their shame**
    if (/^((me)?nyerah|surr?ender)$/i.test(userAnswer)) {
        clearTimeout(this.tebakbendera[id][3]);
        delete this.tebakbendera[id];
        return this.reply(m.chat, `😆 *You surrendered? Pathetic!*  
🔎 *The correct answer was:* *${json.name}*  
🎭 *I expected nothing less from someone with your level of intelligence.*`, m);
    }

    // **Check if the answer is correct**
    if (userAnswer === correctAnswer) {
        if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = { exp: 0 };
        global.db.data.users[m.sender].exp += this.tebakbendera[id][2];

        this.reply(m.chat, `🎉 *Congratulations, you non-disappointing creature!*  
✅ *The correct answer is:* *${json.name}*  
🎁 *XP Earned:* +${this.tebakbendera[id][2]}  
🧠 *Perhaps there is hope for your species after all... but I wouldn’t bet on it.*`, m);
        
        clearTimeout(this.tebakbendera[id][3]);
        delete this.tebakbendera[id];
    } 
    // **Check if the answer is close but slightly incorrect**
    else if (similarity(userAnswer, correctAnswer) >= threshold) {
        m.reply(`⚠️ *Oh, you were *so* close!*  
🔍 *Did your last two brain cells fail you at the last second? Check your spelling and try again!*`);
    } 
    // **Handle incorrect answers, but prevent spam**
    else {
        if (!this.tebakbendera[id].wrongAnswers) this.tebakbendera[id].wrongAnswers = new Set();
        if (this.tebakbendera[id].wrongAnswers.has(userAnswer)) return true; // Ignore repeat wrong answers  

        this.tebakbendera[id].wrongAnswers.add(userAnswer);
        this.reply(m.chat, `❌ *Wrong, wrong, wrong!*  
🙄 *Are you even trying, or are you just pressing random keys like a confused monkey?*`, m);
    }

    return true;
}

export const exp = 0;
