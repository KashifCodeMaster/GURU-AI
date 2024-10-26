let handler = async (m, { conn, args, participants }) => {
    if (!args[0]) {
        await m.react('🚫');
        return m.reply(`Oops! You forgot to give a country code! Try: ${usedPrefix}removecountry 92`);
    }

    const countryCode = args[0].trim();
    const countryPrefix = countryCode.startsWith('+') ? countryCode : `+${countryCode}`;

    await m.react('⏳'); // Show a loading emoji initially

    let removedCount = 0;
    let remainingMembers; // Variable to store the list of remaining members from the specified country

    do {
        // Find members with the specified country code who are not admins
        remainingMembers = participants.filter(participant => {
            const phoneNumber = participant.id.split('@')[0];
            return phoneNumber.startsWith(countryCode) && !participant.admin;
        });

        console.log(`Attempting to remove ${remainingMembers.length} members from country code ${countryCode}...`);

        // Loop over each member and attempt to remove
        for (const member of remainingMembers) {
            try {
                await conn.groupParticipantsUpdate(m.chat, [member.id], 'remove');
                removedCount++;
                console.log(`Successfully removed ${member.id}`);
            } catch (error) {
                console.error(`Failed to remove ${member.id}:`, error);
                continue; // Skip to the next member if there's an error
            }
        }

        // Refresh participant list to check if any members remain
        participants = await conn.groupMetadata(m.chat).participants;

    } while (remainingMembers.length > 0); // Repeat until there are no members left with the country code

    await m.react('✅');
    m.reply(`🎉 All done! Removed ${removedCount} members with the country code ${countryCode}. The group’s now a bit less crowded! 🎊`);
};

handler.help = ['removecountry <country code>'];
handler.tags = ['group'];
handler.command = ['removecountry', 'kickcountry', 'removebycountry'];
handler.admin = true;
handler.botAdmin = true;
handler.group = true;

export default handler;
