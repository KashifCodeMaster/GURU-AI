let handler = async (m, { conn, text, usedPrefix, command, args, participants, isOwner }) => {

  // Check if user is the owner
  if (!isOwner) {
    return conn.sendMessage(
      m.chat,
      {
        text: `Hello @${m.sender.split('@')[0]}, thanks for inviting me! 🎉\n\nYour request has been received and will be processed soon. It may take 3–5 days to complete, so please be patient.\n\nIn the meantime, if you have any queries, you can send us a message.`.trim(),
      },
      { quoted: m }
    );
  }
  
  // Acknowledge the invite with a reaction
  await m.react("💌");

  let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i;
  let delay = (time) => new Promise((res) => setTimeout(res, time));
  
  let [_, code] = text.match(linkRegex) || [];
  if (!args[0]) throw `✳️ Please send the group link.\n\n📌 Example:\n *${usedPrefix + command}* <linkwa>`;
  if (!code) throw `✳️ Invalid link.`;

  // Prepare for joining
  m.reply(`😎 Joining the group in 3 seconds...`);
  await delay(3000);

  try {
    // Attempt to join the group
    let res = await conn.groupAcceptInvite(code);
    let groupName = await conn.getName(res);

    // Send the funny welcome messages
    await conn.sendMessage(
      res,
      `Ladies and Gentlemen, brace yourselves... the Robot has officially joined the group! 🎉\n\n*Hello, humans!* Be prepared, this chat just got a serious upgrade!`,
      { mentions: participants }
    );

    await delay(7000); // A short pause for effect

    // Add the warning message if the bot is an admin
    await conn.sendMessage(
      res,
      `And one more thing... from now on, no links, no spam, and watch your language. Violators will be removed faster than you can say "Oops!" But this only applies if you make me an admin... otherwise, eventually, I might have to leave this group. \n\nSo, heads up, admins! Grant me admin status so I can assist better, or… well, let’s just say I don’t stick around where I’m not appreciated. 😉 `,
      { mentions: participants }
    );

  } catch (e) {
    conn.reply(global.owner[1] + '@s.whatsapp.net', e);
    throw `✳️ Sorry, the bot couldn't join the group.`;
  }
};

handler.help = ['join <chat.whatsapp.com>'];
handler.tags = ['owner'];
handler.command = ['join', 'invite'];

// handler.owner = true

export default handler;
