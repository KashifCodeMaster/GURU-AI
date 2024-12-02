// import db from '../lib/database.js'

let handler = async (m, { conn, text, isROwner, isOwner }) => {
  try {
    if (text) {
      // Save the farewell message in the database
      global.db.data.chats[m.chat].sBye = text;

      // Confirm the farewell message update
      m.reply(
        `✅ Farewell message successfully set!\n\nNow, whenever someone decides to leave this circus—oops, I mean *group*—they'll get your heartfelt (or not-so-heartfelt) goodbye. Let's hope it’s enough to make them reconsider their life choices.`
      );
    } else {
      // Throw an error if no text is provided
      throw `✳️ Seriously? You forgot to include the farewell message.\n\nHere’s how you can spice it up:\n- Use \`@user\` to mention the departing person.\n\nExample: \`Goodbye @user! You’ll be missed… or maybe not. Depends on who you ask.\``;
    }
  } catch (error) {
    // Handle errors with a sarcastic yet clear response
    m.reply(
      `🚫 Uh-oh! Something went wrong.\n\nLooks like you forgot to set the farewell message properly. Don’t worry, even tech-savvy geniuses slip up sometimes. Give it another go!`
    );
    console.error(error);
  }
};

handler.help = ['setbye <text>'];
handler.tags = ['group'];
handler.command = ['setbye'];
handler.admin = true; // Only group admins can use this command
handler.owner = false; // No special permissions for group owners

export default handler;
