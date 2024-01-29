let handler = async (m, { conn, isROwner, text }) => {
    const delay = time => new Promise(res => setTimeout(res, time));

    try {
        let groups = await conn.groupFetchAllParticipating();

        console.log('Groups:', groups); // Log groups variable

        if (!Array.isArray(groups) || groups.length === 0) {
            return m.reply('*Error 404: Active groups not found. Broadcasting requires an audience.*');
        }

        let groupIds = groups.map(group => group.id);
        let broadcastMessage = m.quoted?.text || text;

        if (!broadcastMessage) {
            return m.reply('*Error: Please provide a message for the broadcast.*');
        }

        let header = '📢 **Newsletter Broadcast** 📢\n\n';
        let footer = '\n\n💌 *This message has been sent as part of our newsletter to multiple groups.*';

        let successCount = 0;
        let failureCount = 0;

        for (let groupId of groupIds) {
            await delay(1000); // Increased delay to prevent flooding issues

            try {
                await conn.relayMessage(groupId, {
                    text: `${header}${broadcastMessage}${footer}`,
                    contextInfo: {
                        isForwarded: true,
                        forwardingScore: 999
                    }
                }, {});
                successCount++;
            } catch (error) {
                console.error(`Error broadcasting to group ${groupId}:`, error);
                failureCount++;
                m.reply(`*Error broadcasting to group ${groupId}. Details: ${error}*`);
            }
        }

        let successMessage = successCount > 0 ?
            `*Newsletter broadcast sent successfully to ${successCount} group/s.*\n\n` :
            '*No groups were successfully reached.*\n\n';

        let failureMessage = failureCount > 0 ?
            `*Failed to send to ${failureCount} group/s. Please check the error details.*` :
            '';

        m.reply(`${successMessage}${failureMessage}`);
    } catch (error) {
        console.error('Error in broadcast command:', error);
        m.reply('*🚨 Oops! Something went wrong while broadcasting your message. Our apologies for any inconvenience caused.*');
    }
};

handler.help = ['newsletter', 'broadcast'].map(v => v + ' <text>');
handler.tags = ['owner'];
handler.command = /^(newsletter|broadcast)$/i;
handler.owner = true;

export default handler;
