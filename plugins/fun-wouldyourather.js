import fetch from 'node-fetch';
import fs from 'fs';

const pollHour = 12; // Set the hour (24-hour format) for the poll to be sent
const lastPollFile = 'lastPollDate.txt';

const groupJids = [
    '120363099626473994@g.us',  // Hotline group JID
    '120363331922046554@g.us'   // Additional group JID
];

// Function to get the last poll date from file
function getLastPollDate() {
    try {
        if (fs.existsSync(lastPollFile)) {
            return fs.readFileSync(lastPollFile, 'utf8').trim();
        }
    } catch (err) {
        console.error('Error reading last poll date file:', err);
    }
    return null;
}

// Function to update the last poll date in file
function setLastPollDate(date) {
    try {
        fs.writeFileSync(lastPollFile, date, 'utf8');
    } catch (err) {
        console.error('Error writing last poll date file:', err);
    }
}

// Function to send the Would You Rather poll
async function sendWyrPoll(conn) {
    try {
        const now = new Date();
        const today = now.toDateString();
        const lastPollDate = getLastPollDate();
        
        if (lastPollDate === today) {
            console.log('Poll already sent today. Skipping...');
            return;
        }

        // Fetch poll options from the API
        const res = await fetch('https://api.popcat.xyz/wyr');
        const pollData = await res.json();

        // Prepare poll message
        const pollMessage = {
            name: '*Would you rather*',
            values: [
                pollData.ops1.toLowerCase(),
                pollData.ops2.toLowerCase(),
            ],
            multiselect: false,
            selectableCount: 1,
        };

        // Send the poll to all specified groups
        for (const groupJid of groupJids) {
            await conn.sendMessage(groupJid, { poll: pollMessage });
            console.log(`Poll sent successfully to ${groupJid}`);
        }

        // Update the last poll date
        setLastPollDate(today);
    } catch (err) {
        console.error('Failed to send daily poll:', err);
    }
}

// Function to check if it's the correct time to send a poll
function checkTimeForPoll(conn) {
    const now = new Date();
    if (now.getHours() === pollHour && getLastPollDate() !== now.toDateString()) {
        sendWyrPoll(conn);
    }
}

// Set a recurring check every minute to see if it's time to send the poll
function scheduleDailyPolls(conn) {
    setInterval(() => {
        checkTimeForPoll(conn);
    }, 60 * 1000); // Check every minute
}

// Export the manual handler for WYR command
let handler = async (m, { conn }) => {
    try {
        await m.react('⏳');  // React with a waiting emoji when poll command is triggered

        // Fetch "Would You Rather" poll options from the API
        const res = await fetch('https://api.popcat.xyz/wyr');
        const pollData = await res.json();

        // Prepare poll message
        const pollMessage = {
            name: '*Would you rather*',
            values: [
                pollData.ops1.toLowerCase(),
                pollData.ops2.toLowerCase(),
            ],
            multiselect: false,
            selectableCount: 1,
        };

        // Send the poll
        await conn.sendMessage(m.chat, { poll: pollMessage });
        await m.react('🗳️');  // React with poll emoji after sending the poll
    } catch (err) {
        console.error(err);
        throw 'Something went wrong with the poll, please try again!';
    }
};

handler.help = ['wouldyourather'];
handler.tags = ['fun'];
handler.command = /^wyr$|^wouldyourather$/i;

export default handler;

// Ensure to schedule the automatic poll when the bot starts
scheduleDailyPolls(conn);
