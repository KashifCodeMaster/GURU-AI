let handler = async (m, { conn, args }) => {
    if (!args[0]) {
        await m.react('🚫');
        return m.reply(`Oops! You forgot to give a country code! Try: ${usedPrefix}kickcountry 92`);
    }

    const countryCode = args[0].trim();
    const countryPrefix = countryCode.startsWith('+') ? countryCode : `+${countryCode}`;
    
    await m.react('⏳'); // Show a loading emoji initially

    let removedCount = 0;
    let remainingMembers;

    do {
        try {
            // Wait 3 seconds before each refresh to give the server some cooldown
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Fetch updated participant list
            const groupMetadata = await conn.groupMetadata(m.chat);
            const participants = groupMetadata.participants || [];

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
        } catch (error) {
            console.error('Error fetching participants:', error);
            break; // Stop the loop if fetching participants fails repeatedly
        }

    } while (remainingMembers.length > 0); // Repeat until there are no members left with the country code

    await m.react('✅');
    m.reply(`🎉 All done! Removed ${removedCount} members with the country code ${countryCode}. The group’s now a bit less crowded! 🎊`);
};

handler.help = ['kickcountry <country code>'];
handler.tags = ['group'];
handler.command = ['kickcountry', 'removebycountry', 'removecountry'];
handler.admin = true;
handler.botAdmin = true;
handler.group = true;

export default handler;
