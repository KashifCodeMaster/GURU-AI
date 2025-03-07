let rouletteBets = {}; // Store all bets
let rouletteResult = {}; // Store results
let leaderboard = {}; // Store win/loss records

const handler = async (m, { conn, args, usedPrefix, command }) => {
    let amount = parseInt(args[0]);
    let color = args[1]?.toLowerCase();

    if (args.length < 2) {
        return m.reply(`🎰 *ROULETTE TIME!* 🎰\n\n
        Ready to test your luck? Place a bet on *red* or *black*!  
        
        *Usage:*  
        ➤ _${usedPrefix + command} <amount> <color (red/black)>_  
        
        *Example:*  
        ➤ _${usedPrefix + command} 500 red_  

        🎡 The wheel is spinning… place your bets now!`, m);
    }

    let users = global.db.data.users[m.sender];
    let response = placeBet(m.sender, m.chat, amount, color);

    m.reply(response, m);
    runRoulette(m.chat, conn, m);
};

// Function to handle placing bets
const placeBet = (user, chatId, amount, color) => {
    let validColors = ['red', 'black'];

    if (isNaN(amount) || amount < 500) {
        return `❌ *INVALID BET!* The minimum bet is *500 gold*.`;
    }
    if (!validColors.includes(color)) {
        return `🎨 *INVALID COLOR!* You can only bet on *red* or *black*.`;
    }
    if (global.db.data.users[user].credit < amount) {
        return `💸 *NOT ENOUGH GOLD!* Go earn some before you bet!`;
    }
    if (amount > 100000) {
        return `🛑 *MAX BET LIMIT REACHED!* You can't bet more than *100,000 gold*.`;
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

    return `✅ *BET ACCEPTED!* *@${user.split('@')[0]}* put *${amount} gold* on *${color}*.\n🎡 The wheel is spinning…!`;
};

// Function to start the roulette
const runRoulette = (chatId, conn, m) => {
    const delay = 8 * 1000; // 8 seconds (faster but still suspenseful)

    setTimeout(() => {
        resolveRoulette(chatId, conn, m);
    }, delay);
};

// Function to resolve the roulette
const resolveRoulette = (chatId, conn, m) => {
    if (!rouletteBets[chatId] || rouletteBets[chatId].length === 0) return;

    let colors = ['red', 'black'];
    let landedColor = colors[Math.floor(Math.random() * colors.length)];

    let winners = [];
    let losers = [];
    let resultMessage = `🎡 *ROULETTE SPINS...* 🎡\n\n🕒 *Tick... Tock...* \n\n`;

    setTimeout(() => {
        resultMessage += `🎉 *BALL LANDS ON...* *${landedColor.toUpperCase()}!* 🎉\n\n`;
        
        for (let bet of rouletteBets[chatId]) {
            if (landedColor === bet.color) {
                let jackpot = Math.random() < 0.05 ? bet.amount * 3 : bet.amount; // 5% chance to triple winnings
                winners.push(`💰 *@${bet.user.split('@')[0]}* *WON* *${jackpot} gold*! 🎊`);
                global.db.data.users[bet.user].credit += jackpot;
                leaderboard[bet.user].wins++;
            } else {
                losers.push(`💀 *@${bet.user.split('@')[0]}* *LOST* *${bet.amount} gold*! 😵`);
                global.db.data.users[bet.user].credit -= bet.amount;
                leaderboard[bet.user].losses++;
            }
        }

        resultMessage += winners.length > 0 ? winners.join('\n') : `😔 *No winners this time.* The house wins!`;
        resultMessage += losers.length > 0 ? '\n' + losers.join('\n') : '';

        delete rouletteBets[chatId];
        conn.reply(chatId, resultMessage, m, { mentions: [...winners, ...losers].map(w => w.user) });

        // Show leaderboard update instantly
        conn.reply(chatId, getLeaderboard(), m);
    }, 3000); // Shorter suspense time
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

    return lbMessage.length > 0 ? lbMessage : `🎲 *No one is on the leaderboard yet. Be the first to make history!*`;
};

handler.help = ['gamble <amount> <color(red/black)>'];
handler.tags = ['economy'];
handler.command = ['gamble'];
handler.group = true;

export default handler;
