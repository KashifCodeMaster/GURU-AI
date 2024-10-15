let handler = async (m, { conn, text, args, usedPrefix, command }) => {
    // Split the message text using '|' and slice the array to remove the first part (question).
    let pollOptions = text.split("|").slice(1);

    // Ensure the user provides at least one option and not too many.
    if (!pollOptions[1]) throw `Please use the format:\n${usedPrefix}${command} question |option1|option2`;
    if (pollOptions[12]) throw `Too many options! Please limit to 11 options.\nFormat: ${usedPrefix}${command} question |option1|option2`;

    // Check for duplicate options.
    if (hasDuplicates(pollOptions)) throw "You have duplicate options. Please provide unique options.";

    // Compose the poll message.
    let pollHeader = `*Poll created by:* ${m.name}`;
    let pollQuestion = text.split("|")[0]; // The first part of the message is the poll question.

    // Create the poll structure.
    const pollMessage = {
        name: `${pollHeader}\n\n${pollQuestion}`,
        values: pollOptions,
        multiselect: false,
        selectableCount: 1
    };

    // Send the poll.
    await conn.sendMessage(m.chat, {
        poll: pollMessage
    });
};

// Command help and tags.
handler.help = ["poll question|option1|option2"];
handler.tags = ["group"];
handler.command = /^poll$/i;

export default handler;

// Function to check for duplicate elements in an array.
function hasDuplicates(arr) {
    return new Set(arr).size !== arr.length;
}
