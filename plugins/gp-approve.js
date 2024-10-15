let handler = async (message, { conn, command }) => {
    // React with a waiting emoji when the command is triggered
    await message.react('⏳');

    // Fetch the list of pending group join requests
    const result = await message.groupRequestList();

    // If there are no pending requests, send a humorous message
    if (!result.length) {
        await message.send('Looks like the group is as popular as a forgotten sock in the laundry—no pending requests here! 😄');
        return; // Exit if there are no requests
    }

    // Approve all pending requests
    await message.groupRequestAction(
        result.map((id) => id.jid), // Map to get all IDs from the result
        'approve' // Approve the requests
    );

    // Only welcome all members if all requests have been approved
    const approvedRequestsCount = result.length;
    await message.send(`Approved ${approvedRequestsCount} requests! 🎉 Welcome aboard, you wonderful humans! 🎉`);
    await message.react('✅'); // React with a thumbs-up emoji after approval
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
