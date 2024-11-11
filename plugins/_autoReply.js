export async function all(m) {

  // Only proceed if the message includes a group invite or link in a private chat
  if (
    (m.mtype === 'groupInviteMessage' || m.text.startsWith('https://chat') || m.text.startsWith('open this link')) &&
    !m.isBaileys &&
    !m.isGroup
  ) {
    // React immediately to acknowledge the invite
    await m.react('💌');

    // Send the initial response with a friendly message and instructions for confirmation
    this.sendMessage(
      m.chat,
      {
        text: `Hey @${m.sender.split('@')[0]}! 🎉\n\nThanks for the invite! Just to confirm, are you sure you want me to join this group?\n\nIf you’d like to proceed, just type *JOIN CONFIRM* to officially send your invite. 🚀\n\n_Once confirmed, I’ll take about 3–5 days to process everything, but don’t worry, I’ll keep you posted!_ If you have questions, feel free to ask!`,
      },
      { quoted: m }
    );

    // Function to simulate a delay for sending a follow-up reminder
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(60000); // Wait 60 seconds for the reminder (you can adjust as needed)

    // Check if the user has not responded with "JOIN CONFIRM"
    if (!m.text.includes('JOIN CONFIRM')) {
      // Send a friendly reminder message if they haven't confirmed
      this.sendMessage(
        m.chat,
        {
          text: `⏰ Just a reminder, @${m.sender.split('@')[0]}: if you'd like me to join, please type *JOIN CONFIRM* within the next 5 minutes. Otherwise, I'll assume you changed your mind! 😊`,
        },
        { quoted: m }
      );
    }

    // Optional: Handle confirmation logic if the user replies with "JOIN CONFIRM"
    if (m.text.includes('JOIN CONFIRM')) {
      this.sendMessage(
        m.chat,
        {
          text: `Got it, @${m.sender.split('@')[0]}! 🚀\n\nYour request has been confirmed! I’ll handle everything from here and keep you updated as we go along. Thanks for inviting me!`,
        },
        { quoted: m }
      );

      // Optional: Add additional reactions or responses to make the experience even more interactive
      await m.react('💎');
    }
  }

  return true;
}
