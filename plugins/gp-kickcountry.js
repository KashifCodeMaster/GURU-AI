let handler = async (m, { conn, args, usedPrefix, participants, groupMetadata }) => {
    // Check if a country code is provided
    if (!args[0]) {
        await m.react('🚫'); // React with a stop emoji
        return m.reply(`🚫 Whoa there! You forgot to give me a country code! For example: ${usedPrefix}removecountry 92`);
    }

    const countryCode = args[0].trim(); // Get the country code from the command
    const countryPrefix = countryCode.startsWith('+') ? countryCode : `+${countryCode}`; // Ensure we have the full prefix format

    // Filter participants to find those with the specified country code, excluding admins
    const membersToRemove = participants.filter(participant => {
        const phoneNumber = participant.id.split('@')[0]; // Extract the phone number from the jid
        return phoneNumber.startsWith(countryCode) && !participant.admin; // Check if the phone number starts with the country code
    });

    // Log the number of members to be removed for basic info
    console.log(`Total participants checked: ${participants.length}, Members to remove: ${membersToRemove.length}`);

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

handler.help = ['removecountry <country code>'];
handler.tags = ['group'];
handler.command = ['removecountry', 'removeByCountryCode'];
handler.admin = true; // Only allow admins to use this command
handler.botAdmin = true; // Ensure the bot is an admin
handler.group = true; // Only allow use in groups

export default handler;
