// import db from '../lib/database.js'

let handler = async (m, { conn, text, isROwner, isOwner }) => {
  try {
    if (text) {
      // Save the new welcome message in the database
      global.db.data.chats[m.chat].sWelcome = text;

      // Respond with a confirmation message
      m.reply(
        `✅ Welcome message updated successfully!\n\nSo, here's the deal: anyone who walks into this group now gets this fancy new message you just set. Let's hope it’s not too cheesy—or maybe that's exactly what you were going for.`
      );
    } else {
      // Throw an error if no text is provided
      throw `⚠️ Oh, come on! You can't set an empty welcome message.\n\nHere’s how you can do it:\n- Use \`@user\` to tag the new member.\n- Use \`@group\` to include the group's name (because we all love that personal touch).\n- Use \`@desc\` if you want to remind them why they joined this chaos in the first place.\n\nExample: \`Welcome @user to @group! Here’s what you need to know: @desc\``;
    }
  } catch (error) {
    // Catch and display any errors
    m.reply(
      `🚫 Oops, something went wrong!\n\nIt seems like you didn’t provide a valid welcome message. If this keeps happening, maybe blame the group admin... oh wait, that's you.`
    );
    console.error(error);
  }
};

handler.help = ['setwelcome <text>'];
handler.tags = ['group'];
handler.command = ['setwelcome'];
handler.admin = true; // Only group admins can use this command
handler.owner = false; // Bot owners don’t have special permissions for this

export default handler;
