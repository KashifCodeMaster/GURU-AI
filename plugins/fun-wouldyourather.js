import fetch from 'node-fetch';

let lastPollHour = null;  // Track the last hour a poll was sent

// Predefined poll hours (24-hour format)
const pollHours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

// Function to send the Would You Rather poll
async function sendWyrPoll(conn) {
    try {
        const groupJid = '120363099626473994@g.us';  // Hotline group JID

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

        // Send the poll to the specific group (Hotline)
        await conn.sendMessage(groupJid, { poll: pollMessage });
        console.log('Poll sent successfully at the correct time.');

        // Update the last poll hour to the current hour
        const now = new Date();
        lastPollHour = now.getHours();

    } catch (err) {
        console.error('Failed to send hourly poll:', err);
    }
}

// Function to check if it's the correct time to send a poll
function checkTimeForPoll(conn) {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Check if the current hour is in the pollHours list and no poll has been sent this hour
    if (pollHours.includes(currentHour) && currentMinute === 0 && currentHour !== lastPollHour) {
        sendWyrPoll(conn);  // Send poll at the start of the hour if not already sent
    }
}

// Set a recurring check every minute to see if it's time to send the poll
function schedulePredefinedPolls(conn) {
    setInterval(() => {
        checkTimeForPoll(conn);  // Check the time every minute
    }, 60 * 1000);  // 1 minute in milliseconds
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
handler.command = /^wyr$/i;

export default handler;

// Ensure to schedule the automatic poll when the bot starts
schedulePredefinedPolls(conn);  // Ensure conn is properly defined in your context
