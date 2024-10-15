import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
    try {
        await m.react('⏳');  // React with "waiting" emoji when poll command is triggered
        
        // Fetch "Would You Rather" poll options from the API
        const res = await fetch('https://api.popcat.xyz/wyr');
        const pollData = await res.json();

        // Prepare poll with the fetched options
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
        await m.react('🗳️');  // React with "poll" emoji after sending poll

    } catch (err) {
        console.error(err);
        throw 'Something went wrong with the poll, please try again!';
    }
};

// Flag to track if the hourly poll is initialized
let hourlyPollInitialized = false;

// Function to send the poll automatically to the Hotline group every hour
async function sendHourlyPoll(conn) {
    try {
        const groupJid = '120363099626473994@g.us';  // Hotline group JID

        // Fetch poll options from the API
        const res = await fetch('https://api.popcat.xyz/wyr');
        const pollData = await res.json();

        // Create the poll message
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
        console.log('Sent automatic poll to Hotline group.');

    } catch (err) {
        console.error('Failed to send hourly poll:', err);
    }
}

// Set up automatic poll sending exactly at the start of every hour
function scheduleHourlyPoll(conn) {
    if (hourlyPollInitialized) return;  // Prevent re-initialization

    hourlyPollInitialized = true;  // Mark as initialized

    const now = new Date();
    const minutesTillNextHour = (60 - now.getMinutes()) * 60 * 1000 - now.getSeconds() * 1000;
    
    // Set the first poll to start exactly on the next hour
    setTimeout(() => {
        sendHourlyPoll(conn);  // Send the first poll
        setInterval(() => sendHourlyPoll(conn), 60 * 60 * 1000);  // Continue sending polls every hour
    }, minutesTillNextHour);
}

// Export the manual handler
handler.help = ['wouldyourather'];
handler.tags = ['fun'];
handler.command = /^wyr$/i;

export default handler;

// Start the automatic poll schedule when the bot starts
scheduleHourlyPoll(conn);  // Pass the connection object (conn) to start scheduling
