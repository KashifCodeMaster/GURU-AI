let handler = async (m, { conn, participants, args, usedPrefix }) => {
    // Check if a country code is provided
    if (!args[0]) {
        await m.react('🚫'); // React with a stop emoji
        return m.reply(`🚫 Whoa there! You forgot to give me a country code! For example: ${usedPrefix}removecountry 92`);
    }

    const countryCode = args[0]; // Get the country code from the command
    const countryPrefix = `+${countryCode}`; // Create the full prefix for the phone numbers

    // Filter participants to find those with the specified country code, excluding admins
    const membersToRemove = participants.filter(participant => 
        participant.id.startsWith(countryPrefix) && !participant.admin
    );

    // Check if any members are found for removal
    if (membersToRemove.length === 0) {
        await m.react('✅'); // React with a tick emoji for no removals
        return m.reply(`✅ Looks like no one with the country code ${countryCode} is here! Maybe they’re on a vacation? 🏖️`);
    }

    // React with a waiting emoji
    await m.react('⏳'); // React with a waiting emoji

    // Loop through each member and remove them one by one
    for (const member of membersToRemove) {
        await conn.groupParticipantsUpdate(m.chat, [member.id], 'remove');
    }

    // React with a tick emoji to confirm completion
    await m.react('✅'); // React with a tick emoji

    // Fun confirmation message
    m.reply(`🎉 Voilà! All members with the country code ${countryCode} have been sent packing one by one! ✈️ Hopefully, they don't miss the party too much! 🎊`);
};

// Function to sleep for a specified duration
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

handler.help = ['removecountry <country code>'];
handler.tags = ['group'];
handler.command = ['removecountry', 'removeByCountryCode'];
handler.admin = true; // Only allow admins to use this command
handler.botAdmin = true; // Ensure the bot is an admin
handler.group = true; // Only allow use in groups

export default handler;
