const xpperbank = 1;

let handler = async (m, { conn, command, args, usedPrefix }) => {
    let user = global.db.data.users[m.sender];

    if (!user) throw `🟨 Your data is not found in my database. Try interacting with the bot first.`;

    let maxDeposit = Math.floor(user.credit / xpperbank); // Maximum depositable amount
    let count = /depall/i.test(command) 
        ? maxDeposit 
        : parseInt(args[0]) || 1;

    count = Math.max(1, count);

    if (user.credit >= xpperbank * count) {
        user.credit -= xpperbank * count;
        user.bank += count;

        let transactionId = Math.random().toString(36).substr(2, 10).toUpperCase(); // Random Transaction ID

        let message = `🏦 *Deposit Successful* 🏦

✅ *Transaction ID:* ${transactionId}  
💰 *Amount Deposited:* 🪙 ${count.toLocaleString()} gold  
📜 *Remaining Wallet Balance:* 🪙 ${user.credit.toLocaleString()} gold  
🏛️ *New Bank Balance:* 🏦 ${user.bank.toLocaleString()} gold  

🔹 *To check your full balance, use:*  
${usedPrefix}wallet  

⚠️ *Reminder:*  
- Your gold is now safe in the bank.  
- Withdraw anytime using \`${usedPrefix}withdraw <amount>\`.  
- Keep an eye on your balance to manage your wealth wisely!  
`;

        conn.reply(m.chat, message, m);
    } else {
        conn.reply(m.chat, `🟥 *Transaction Failed*  

🚫 You don't have enough gold in your wallet to deposit ${count.toLocaleString()} gold.  
💰 *Available Wallet Balance:* 🪙 ${user.credit.toLocaleString()} gold  

🔹 Try a smaller amount or check your balance using:  
${usedPrefix}wallet  
`, m);
    }
};

handler.help = ['deposit'];
handler.tags = ['economy'];
handler.command = ['deposit', 'dep', 'depall'];

export default handler;
