let handler = async (m, { conn, command }) => {
    try {
        // React with a waiting emoji when the command is triggered
        await m.react('⏳');

        const groupId = m.chat; // Get the group ID from the message

        // Fetch the group metadata to check the current member count
        const groupMetadata = await conn.groupMetadata(groupId);
        const currentMemberCount = groupMetadata.participants.length;

        console.log(`Current member count: ${currentMemberCount}`);

        // Check if the group is full
        if (currentMemberCount >= 1025) {
            await m.reply('The group is already full with 1025 members! 🚫 No more requests can be approved.');
            return; // Exit early if the group is full
        }

        // Fetch the list of pending group join requests
        const result = await conn.groupRequestParticipantsList(groupId);

        // Log the result to debug any potential issues
        console.log('Pending join requests:', result);

        // If there are no pending requests, send a humorous message
        if (!result || result.length === 0) {
            await m.reply('Looks like the group is as popular as a forgotten sock in the laundry—no pending requests here! 😄');
            return; // Exit if there are no requests
        }

        // Approve each request one by one
        const requestIds = result.map((participant) => participant.jid); // Map to get all JIDs from the result
        console.log('Request IDs to approve:', requestIds); // Log the IDs to be approved

        for (const jid of requestIds) {
            // Check again if the group is full before approving each request
            if (currentMemberCount >= 1025) {
                await m.reply('Stopped processing further requests as the group is now full. 🚫');
                break; // Exit the loop if the group is full
            }

            try {
                const approvalResult = await conn.groupRequestParticipantsUpdate(
                    groupId, // Group ID
                    [jid], // Single JID to approve
                    'approve' // Approve the request
                );
                console.log(`Approved request for ${jid}:`, approvalResult); // Log approval result

                // Update the member count after approval
                currentMemberCount++;
            } catch (error) {
                console.error(`Failed to approve ${jid}:`, error); // Log any errors for individual approvals
            }
        }

        // Send a success message after processing requests
        await m.reply(`Approved ${requestIds.length} requests! 🎉 Welcome aboard, you wonderful humans! 🎉`);
        await m.react('✅'); // React with a thumbs-up emoji after approval
    } catch (err) {
        // Log the error for debugging purposes
        console.error('Error handling group join request approval:', err);

        // Reply with an error message if something goes wrong
        await m.reply('Oops! Something went wrong while processing the group requests. Please try again later.');
    }
};

// Define the command that triggers this handler
handler.help = ['approve', 'accept'];
handler.tags = ['group'];
handler.command = /^(approve|accept)$/i;

// Set the required properties for group, admin, and botAdmin checks
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
