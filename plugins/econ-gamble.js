let rouletteBets = {}; // Store all bets
let rouletteResult = {}; // Store results
let leaderboard = {}; // Store win/loss records

const handler = async (m, { conn, args, usedPrefix, command }) => {
    let amount = parseInt(args[0]);
    let color = args[1]?.toLowerCase();
    
    if (args.length < 2) {
        return m.reply(`🎰 *WELCOME TO THE HIGH-STAKES ROULETTE!* 🎰\n\n
        Feeling lucky? Place your bet now!  
        
        *Usage:*  
        ➤ _${usedPrefix + command} <amount> <color (red/black)>_  
        
        *Example:*  
        ➤ _${usedPrefix + command} 500 red_  

        🎡 The wheel is waiting... do you dare to spin?`);
    }

    let users = global.db.data.users[m.sender];
    let response = placeBet(m.sender, m.chat, amount, color);

    m.reply(response);
    runRoulette(m.chat, conn);
};

// Function to handle placing bets
const placeBet = (user, chatId, amount, color) => {
    let validColors = ['red', 'black'];

    if (isNaN(amount) || amount < 500) {
        return `❌ *INVALID BET!* The minimum bet is *500 gold*. No pocket change here, pal.`;
    }
    if (!validColors.includes(color)) {
        return `🎨 *INVALID COLOR!* You can only bet on *red* or *black*. No rainbows allowed.`;
    }
    if (global.db.data.users[user].credit < amount) {
        return `💸 *INSUFFICIENT FUNDS!* You're trying to bet more than you have. Maybe go hustle for some gold first?`;
    }
    if (amount > 100000) {
        return `🛑 *TOO RICH FOR THIS TABLE!* You can't bet more than *100,000 gold*. Try flexing somewhere else.`;
    }

    if (!rouletteBets[chatId]) {
        rouletteBets[chatId] = [];
    }

    rouletteBets[chatId].push({ user, amount, color });

    // Track user bet history
    if (!leaderboard[user]) {
        leaderboard[user] = { wins: 0, losses: 0, totalBet: 0 };
    }
    leaderboard[user].totalBet += amount;

    return `✅ *BET ACCEPTED!* You just put *${amount} gold* on *${color}*.\n🎡 The wheel is spinning... may fate be kind!`;
};

// Function to start the roulette
const runRoulette = (chatId, conn) => {
    const delay = 15 * 1000; // 15 seconds

    setTimeout(() => {
        resolveRoulette(chatId, conn);
    }, delay);
};

// Function to resolve the roulette
const resolveRoulette = (chatId, conn) => {
    if (!rouletteBets[chatId] || rouletteBets[chatId].length === 0) return;

    let colors = ['red', 'black'];
    let landedColor = colors[Math.floor(Math.random() * colors.length)];

    let winners = [];
    let resultMessage = `🎡 *THE ROULETTE SPINS...* 🎡\n\n🌀 *Round and round it goes...*\n🕒 *Tick... Tock...* \n\n`;

    setTimeout(() => {
        resultMessage += `\n🎉 *AND THE BALL LANDS ON...* *${landedColor.toUpperCase()}!* 🎉\n\n`;
        
        for (let bet of rouletteBets[chatId]) {
            let result = '';

            if (landedColor === bet.color) {
                let jackpot = Math.random() < 0.05 ? bet.amount * 3 : bet.amount; // 5% chance to triple winnings
                result = `💰 *@${bet.user.split('@')[0]}* *WON* *${jackpot} gold*! 🍀`;
                global.db.data.users[bet.user].credit += jackpot;
                leaderboard[bet.user].wins++;
                winners.push(result);
            } else {
                result = `💀 *@${bet.user.split('@')[0]}* *LOST* *${bet.amount} gold*! Maybe next time… or maybe quit while you're behind.`;
                global.db.data.users[bet.user].credit -= bet.amount;
                leaderboard[bet.user].losses++;
            }
        }

        resultMessage += winners.length > 0 ? winners.join('\n') : `😔 *No winners this time.* Looks like the house takes it all!`;

        delete rouletteBets[chatId];
        conn.reply(chatId, resultMessage, null, { mentions: winners.map(w => w.user) });

        // Show leaderboard update
        setTimeout(() => {
            conn.reply(chatId, getLeaderboard(), null);
        }, 5000);
    }, 5000);
};

// Function to get leaderboard standings
const getLeaderboard = () => {
    let sortedPlayers = Object.entries(leaderboard)
        .sort((a, b) => b[1].wins - a[1].wins)
        .slice(0, 5);

    let lbMessage = `🏆 *ROULETTE LEADERBOARD* 🏆\n\n`;
    sortedPlayers.forEach(([user, stats], index) => {
        lbMessage += `${index + 1}. @${user.split('@')[0]} ➤ *Wins:* ${stats.wins} | *Losses:* ${stats.losses} | *Total Bet:* ${stats.totalBet} gold\n`;
    });

    return lbMessage.length > 0 ? lbMessage : `🎲 *No one has made it to the leaderboard yet. Be the first!*`;
};

handler.help = ['gamble <amount> <color(red/black)>'];
handler.tags = ['economy'];
handler.command = ['gamble'];
handler.group = true;

export default handler;
