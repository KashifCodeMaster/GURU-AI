import { exec } from 'child_process';
import speed from 'performance-now';

let handler = async (m, { conn, args, usedPrefix }) => {
    // Define individual and global rate limits
    const userRateLimit = 1; // Each user can use once every 10 minutes
    const globalRateLimit = 3; // Total usage by all users: 3 uses every 30 minutes
    const cooldownTime = 10 * 60 * 1000; // 10 minutes per user
    const globalCooldownTime = 30 * 60 * 1000; // 30 minutes global limit

    const userKey = m.sender;
    const now = Date.now();

    // Initialize rate limits if missing
    if (!global.rateLimits) global.rateLimits = {};
    if (!global.globalUsage) global.globalUsage = { count: 0, lastUsed: 0 };

    // Check user-specific rate limit
    if (global.rateLimits[userKey] && global.rateLimits[userKey].count >= userRateLimit && (now - global.rateLimits[userKey].lastUsed) < cooldownTime) {
        const timeLeft = Math.ceil((cooldownTime - (now - global.rateLimits[userKey].lastUsed)) / 1000);
        return m.reply(`*⏳ Hold up!* You’re on cooldown for ${timeLeft} seconds. 😅`);
    }

    // Check global rate limit
    if (global.globalUsage.count >= globalRateLimit && (now - global.globalUsage.lastUsed) < globalCooldownTime) {
        const globalTimeLeft = Math.ceil((globalCooldownTime - (now - global.globalUsage.lastUsed)) / 1000);
        return m.reply(`*🌐 Global Limit Hit!* Wait ${globalTimeLeft} seconds to use countdown again.`);
    }

    // Set up mode and start number
    let mode = args[0]?.toLowerCase();
    let startNumber = parseInt(args[1]);

    // Provide usage help if inputs are incorrect
    if (!mode) {
        return m.reply(`*Countdown Usage*\n\nUsage: ${usedPrefix}countdown <normal|fast> <number>\nExample: ${usedPrefix}countdown normal 10\n\nModes:\n- *normal*: 1 sec per count\n- *fast*: 0.3 sec per count\n\nMax: 80`);
    }
    if (isNaN(startNumber) || startNumber > 80) {
        return m.reply(`*Enter a valid count!* (Max: 80)`);
    }

    // Interval adjustments and countdown initiation
    const interval = mode === 'fast' ? 300 : 1000;
    const pauseBetweenCounts = 3000; // 3-second default pause between each count

    // Update rate limit tracking
    if (!global.rateLimits[userKey]) {
        global.rateLimits[userKey] = { count: 1, lastUsed: now };
    } else {
        global.rateLimits[userKey].count += 1;
        global.rateLimits[userKey].lastUsed = now;
    }
    global.globalUsage.count += 1;
    global.globalUsage.lastUsed = now;

    // Start countdown with initial message
    m.react('⏳');
    let countdownMsg = await conn.sendMessage(m.chat, { text: `Starting countdown from ${startNumber}... Buckle up! 🚀` }, { quoted: m });

    for (let i = startNumber; i >= 0; i--) {
        setTimeout(async () => {
            let messageText = '';
            let specialPause = 0;

            // 40% chance to skip messaging for a less predictable countdown
            if (Math.random() < 0.4) {
                messageText = `${i}`;
            } else {
                // Distinct, varied messages for special numbers
                if (i === 69) {
                    messageText = `69... *Ooooh...you waited for this, didn’t you?* 😏💋🔥 Time to get closer... *way* closer... 🤭💃 Are you ready for the heat? 🌡️🔥💥`;
                    specialPause = 4000; // Extended pause at 69 for emphasis
                } else if (i === 42) {
                    messageText = `42... *The answer to everything!* 🤯 Are you feeling enlightened yet? 🌌✨`;
                } else if (i === 30) {
                    messageText = `30... *Only 30 left!* Are you ready for the final sprint? 💪🚀`;
                } else if (i === 20) {
                    messageText = `20... *Can you feel the countdown rush?* Only 20 to go, let's push through! 🔥`;
                } else if (i === 10) {
                    messageText = `10... *Final stretch!* We're almost at the finish line! 🎉`;
                } else if (i === 5) {
                    messageText = `5... *Only 5 seconds to go!* This is it! 🎆`;
                } else if (i === 1) {
                    messageText = `1... *Almost there...* Ready for the grand finale? 🥳`;
                } else if (i === 0) {
                    messageText = `🎉 *Countdown Complete!* You made it all the way! Well done! 🌟`;
                    m.react('🎊');
                } else {
                    // Randomized dynamic messages for non-special numbers
                    const funMessages = [
                        `${i}... *Steady as she goes!* 🚢 Keep your pace!`,
                        `${i}... *Only a few more to go!* Keep the energy high! 💪`,
                        `${i}... *The finish line is closer!* Stay focused! 🏁`,
                        `${i}... *You’re unstoppable!* Nothing can hold you back now! 🔥`,
                        `${i}... *Can you feel the intensity?* Almost there!`,
                        `${i}... *Pace yourself!* Only a few left to the end! 🌠`,
                        `${i}... *Legendary countdown underway!* Keep it rolling!`,
                        `${i}... *This is where champions shine!* 🏆 Keep it steady!`,
                        `${i}... *Are you feeling the momentum?* 🏅 Let's finish strong!`
                    ];
                    messageText = funMessages[Math.floor(Math.random() * funMessages.length)];
                }
            }

            // Send countdown message
            await conn.relayMessage(m.chat, {
                protocolMessage: {
                    key: countdownMsg.key,
                    type: 14,
                    editedMessage: {
                        conversation: messageText
                    }
                }
            }, {});

            // Insert pauses at significant numbers
            await new Promise(resolve => setTimeout(resolve, specialPause || pauseBetweenCounts));
        }, (startNumber - i) * interval);
    }
};

// Help, tags, and commands
handler.help = ['countdown <normal|fast> <number>'];
handler.tags = ['fun'];
handler.command = ['countdown', 'count'];

export default handler;
