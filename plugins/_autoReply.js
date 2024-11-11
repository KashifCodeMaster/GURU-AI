export async function all(m) {
  // Only respond if the message contains a group invite link or similar text, in a private chat
  if (
    (m.mtype === 'groupInviteMessage' || m.text.toLowerCase().startsWith('https://chat') || m.text.toLowerCase().startsWith('open this link')) &&
    !m.isBaileys &&
    !m.isGroup
  ) {
    // React to acknowledge the invite message
    await m.react('💌');

    // Send the initial message with instructions for confirmation
    this.sendMessage(
      m.chat,
      {
        text: `Hey @${m.sender.split('@')[0]}! 🎉\n\nThanks for inviting me! Just to confirm, are you sure you want me to join this group?\n\nIf you’d like me to join, just type *JOIN CONFIRM* to make it official. 🚀\n\n_Once confirmed, I’ll start processing your request, which usually takes 3–5 days._ Feel free to ask questions, and our support agent will try to help you!`,
      },
      { quoted: m }
    );

    // Flag to track whether the user has confirmed
    m.confirmed = false;

    // Set a timeout for 4 minutes (240000 ms) to automatically cancel the request
    setTimeout(async () => {
      if (!m.confirmed) {
        // Cancel the request after 4 minutes and remove further follow-ups
        // Optionally, you can log this or handle it in a different way if you like
        console.log(`Request cancelled due to timeout for user @${m.sender.split('@')[0]}`);
      }
    }, 240000); // Timeout set for 4 minutes (4 * 60 * 1000 ms)
  }

  // Check if the message is from the user and contains "JOIN CONFIRM" (case-insensitive)
  if (m.text && m.text.toLowerCase().includes('join confirm') && m.sender !== this.user.jid) {
    // If the user hasn't confirmed yet
    if (!m.confirmed) {
      // React with a bot emoji for extra confirmation
      await m.react('🤖'); // Confirmation reaction

      // Send a confirmation message after receiving JOIN CONFIRM
      this.sendMessage(
        m.chat,
        {
          text: `Thanks for confirming, @${m.sender.split('@')[0]}! 🚀\n\nYour request has been logged, and I’ll handle everything from here. Keep an eye out for updates as I process your invite. Thanks for trusting me with your group!`,
        },
        { quoted: m }
      );

      // Update the flag to indicate confirmation was received
      m.confirmed = true;
    }
  }

  return true;
}
