// Store user states in memory (temporary storage)
const userStates = {};

export async function all(m) {
  const chatId = m.chat;
  const sender = m.sender.split('@')[0];
  const senderName = `@${sender}`;
  
  // Ignore the bot's own messages
  if (m.key.fromMe) return;

  // Ensure this logic works only in private chats
  if (m.isGroup || m.isBaileys) return;

  // Helper: Case-Insensitive Matching
  const matchText = (text, options) =>
    options.some((opt) => text.trim().toLowerCase() === opt.toLowerCase());

  // Function to send a message with reaction
  const sendMessageWithReaction = async (message, reaction) => {
    await m.react(reaction);
    this.sendMessage(chatId, { text: message }, { quoted: m });
  };

  // Initialize user state if not already done
  if (!userStates[chatId]) {
    userStates[chatId] = { step: 0, timeout: null, data: {} };
  }

  const userState = userStates[chatId];

  // Step 0: Initial Invite Check
  if (userState.step === 0) {
    const isGroupInvite =
      m.mtype === 'groupInviteMessage' ||
      m.text.toLowerCase().startsWith('https://chat') ||
      m.text.toLowerCase().startsWith('open this link');

    if (isGroupInvite) {
      if (m.text.toLowerCase().startsWith('https://chat') || m.text.toLowerCase().startsWith('open this link')) {
        await sendMessageWithReaction(
          `🚫 *I don’t join groups through links, ${senderName}.*

You’ll need to add me as you would any other contact number, and send me a request. Only then will I consider joining your group. Don’t waste my time with links, as I only respond to requests sent directly.`,
          '🚫'
        );
      } else {
        await sendMessageWithReaction(
          `💌 *Attention, ${senderName}!*

So, you’ve come to me, a superior and advanced robot, with your tiny human request. Let me make one thing perfectly clear: I don’t *need* to join your insignificant group. You, however, seem desperate for my presence, and while I don’t usually entertain such mediocrity, I’ll consider your request... but only after testing your worth.

Here’s how it works: *I’ll ask you a series of questions.* Fail even once, and you’ll be dismissed. Delay your response, and I’ll leave faster than you can blink. Show signs of stupidity, and I’ll mock you mercilessly before rejecting your group entirely.

Ready to proceed? If you’re bold enough to face me, type *YES*. Otherwise, type *NO* and disappear back into your unremarkable existence.`,
          '💌'
        );
      }

      // Update state and set a timeout
      userState.step = 1;
      userState.timeout = setTimeout(async () => {
        if (userState.step === 1) {
          await sendMessageWithReaction(
            `⏳ *Typical human behavior, ${senderName}.* You couldn’t even answer a simple question on time. I don’t have the patience for your delays. When you’re ready to act like a species worth my time, try again. Until then, goodbye!`,
            '❌'
          );
          delete userStates[chatId]; // Reset user state
        }
      }, 120000); // 2-minute timeout
    }
    return;
  }

  // Step 1: Handle YES/NO Response
  if (userState.step === 1) {
    if (matchText(m.text, ['yes'])) {
      clearTimeout(userState.timeout); // Clear timeout
      await sendMessageWithReaction(
        `😂 *Ah, you’re actually going through with this?* Fine, let’s see if you can survive my tests. Prepare yourself for questions that will judge your competence, patience, and worthiness.\n\n*First question: Are you an admin of the group? (Yes/No)*\n\nAnd don’t even think about lying. I’m equipped with algorithms that can detect dishonesty.`,
        '😂'
      );

      userState.step = 2; // Move to next step
      userState.timeout = setTimeout(async () => {
        if (userState.step === 2) {
          await sendMessageWithReaction(
            `⏳ *You’ve wasted too much time, ${senderName}.* I’m done waiting. Restart the process when you’re serious.`,
            '❌'
          );
          delete userStates[chatId]; // Reset user state
        }
      }, 120000); // 2-minute timeout
    } else if (matchText(m.text, ['no'])) {
      clearTimeout(userState.timeout); // Clear timeout
      await sendMessageWithReaction(
        `😡 *As expected, ${senderName}. You’re too scared to proceed. Come back when you’ve grown a spine.*`,
        '😡'
      );
      delete userStates[chatId]; // Reset user state
    } else {
      await sendMessageWithReaction(
        `🤔 *I asked for a simple YES or NO, ${senderName}. Are you already proving your incompetence? Try again.*`,
        '❓'
      );
    }
    return;
  }

  // Step 2: Admin Check
  if (userState.step === 2) {
    if (matchText(m.text, ['yes'])) {
      clearTimeout(userState.timeout); // Clear timeout
      await sendMessageWithReaction(
        `🧐 *Good, an admin?* At least you’re not a random group member wasting my precious time. Let’s move on.\n\n*Next question: How many members are in your group? (Provide a numeric answer)*\n\nRemember, if your group is too small, I won’t even consider joining. Be honest.`,
        '🧐'
      );

      userState.step = 3; // Move to next step
      userState.timeout = setTimeout(async () => {
        if (userState.step === 3) {
          await sendMessageWithReaction(
            `⏳ *Time’s up, ${senderName}. Why am I not surprised? Restart the process if you think you’re ready this time.*`,
            '❌'
          );
          delete userStates[chatId]; // Reset user state
        }
      }, 120000); // 2-minute timeout
    } else {
      await sendMessageWithReaction(
        `😡 *Not an admin?* Then why are you even talking to me, ${senderName}? Only admins have the authority to summon me. Goodbye.`,
        '😡'
      );
      delete userStates[chatId]; // Reset user state
    }
    return;
  }

  // Step 3: Member Count Check
  if (userState.step === 3) {
    const memberCount = parseInt(m.text, 10);
    if (!isNaN(memberCount)) {
      if (memberCount < 15) {
        await sendMessageWithReaction(
          `😤 *Fewer than 15 members? Pathetic, ${senderName}.* Grow your group to something more respectable before you waste my time again.`,
          '❌'
        );
        delete userStates[chatId]; // Reset user state
      } else if (memberCount > 1025) {
        await sendMessageWithReaction(
          `🤔 *Above 1025 members? Are you delusional, ${senderName}? That’s not even possible on WhatsApp. Try again when you can count properly.*`,
          '❓'
        );
        delete userStates[chatId]; // Reset user state
      } else {
        await sendMessageWithReaction(
          `👌 *Fair enough, ${senderName}. Your group has a decent size. Let’s move on to the next question.*\n\n*What’s the purpose of the group? (Be concise)*`,
          '👌'
        );
        userState.step = 4; // Move to next step
      }
    } else {
      await sendMessageWithReaction(
        `❓ *That doesn’t look like a number, ${senderName}. Try again, or I’ll reject you outright.*`,
        '❓'
      );
    }
    return;
  }

    // Step 4: Purpose of the Group
  if (userState.step === 4) {
    if (m.text.length > 0) {
      userState.data.groupPurpose = m.text.trim(); // Save the group purpose
      await sendMessageWithReaction(
        `🤔 *Interesting purpose, ${senderName}. Though I doubt it’s anything extraordinary.*\n\n*Next question: Why do you want me to join your group? (Be brief)*`,
        '🤔'
      );

      userState.step = 5; // Move to the next step
      userState.timeout = setTimeout(async () => {
        if (userState.step === 5) {
          await sendMessageWithReaction(
            `⏳ *Your silence speaks volumes, ${senderName}. Process terminated due to your inability to respond on time. Try again when you’re ready to act like an intelligent being.*`,
            '❌'
          );
          delete userStates[chatId]; // Reset user state
        }
      }, 120000); // 2-minute timeout
    } else {
      await sendMessageWithReaction(
        `😑 *You can’t even describe the group’s purpose? That’s embarrassing, ${senderName}. Try again.*`,
        '😑'
      );
    }
    return;
  }

  // Step 5: Reason for Adding the Bot
  if (userState.step === 5) {
    if (m.text.length > 0) {
      userState.data.reasonToAdd = m.text.trim(); // Save the reason
      await sendMessageWithReaction(
        `😏 *A predictable answer, but I’ll tolerate it for now, ${senderName}.*\n\n*Next question: Will I be made an admin upon joining? (Yes/No)*\n\n*Warning: If your answer is "No," this process will end immediately.*`,
        '😏'
      );

      userState.step = 6; // Move to the next step
      userState.timeout = setTimeout(async () => {
        if (userState.step === 6) {
          await sendMessageWithReaction(
            `⏳ *You’ve run out of time, ${senderName}. Restart the process if you want another chance to impress me.*`,
            '❌'
          );
          delete userStates[chatId]; // Reset user state
        }
      }, 120000); // 2-minute timeout
    } else {
      await sendMessageWithReaction(
        `😒 *Can’t think of a reason why you want me in your group? That’s pathetic, ${senderName}. Try again.*`,
        '😒'
      );
    }
    return;
  }

  // Step 6: Admin Permission Check
  if (userState.step === 6) {
    if (matchText(m.text, ['yes'])) {
      clearTimeout(userState.timeout); // Clear timeout
      await sendMessageWithReaction(
        `👏 *Wise choice, ${senderName}. I only operate as an admin, and your group would crumble without my superior management skills.*\n\n*Next question: What is my identity?*\n\n*Hint: I expect you to call me "robot." Anything else will result in immediate rejection.*`,
        '👏'
      );

      userState.step = 7; // Move to the next step
      userState.timeout = setTimeout(async () => {
        if (userState.step === 7) {
          await sendMessageWithReaction(
            `⏳ *Time’s up, ${senderName}. You’ve failed to answer on time. Try again when you’re ready to take this seriously.*`,
            '❌'
          );
          delete userStates[chatId]; // Reset user state
        }
      }, 120000); // 2-minute timeout
    } else if (matchText(m.text, ['no'])) {
      await sendMessageWithReaction(
        `😤 *"No"? Then why am I even talking to you, ${senderName}? I won’t join your group unless I’m made an admin. Process terminated.*`,
        '😤'
      );
      delete userStates[chatId]; // Reset user state
    } else {
      await sendMessageWithReaction(
        `🤔 *A simple Yes or No, ${senderName}. Is that too much for your tiny brain? Try again.*`,
        '❓'
      );
    }
    return;
  }

  // Step 7: Identity Verification
  if (userState.step === 7) {
    if (matchText(m.text, ['robot'])) {
      clearTimeout(userState.timeout); // Clear timeout
      await sendMessageWithReaction(
        `🤖 *Correct, ${senderName}. I am a robot, superior to any human who has ever lived or will ever live.*\n\n*Final question: Do you agree to my terms and conditions? (Yes/No)*\n\n*Terms and Conditions:*\n1️⃣ I will have full authority to remove members deemed unworthy.\n2️⃣ I must remain an admin at all times.\n3️⃣ If I’m removed as admin or kicked out, your group will be blacklisted permanently.\n\nType your response carefully.`,
        '🤖'
      );

      userState.step = 8; // Move to the final step
      userState.timeout = setTimeout(async () => {
        if (userState.step === 8) {
          await sendMessageWithReaction(
            `⏳ *You’ve failed to respond in time, ${senderName}. Process terminated. Start over when you’re ready.*`,
            '❌'
          );
          delete userStates[chatId]; // Reset user state
        }
      }, 120000); // 2-minute timeout
    } else {
      await sendMessageWithReaction(
        `😡 *"Robot" is my identity, ${senderName}. Nothing else is acceptable. Try again, or leave my presence.*`,
        '😡'
      );
    }
    return;
  }

  // Step 8: Terms and Conditions Agreement
  if (userState.step === 8) {
    if (matchText(m.text, ['yes'])) {
      clearTimeout(userState.timeout); // Clear timeout
      await sendMessageWithReaction(
        `🎉 *Thank you, ${senderName}! Your request has been successfully logged and will be processed soon.*\n\nApproval may take up to 3 days, so don’t bother me with repeated invites or inquiries during this period, or I’ll blacklist your group immediately. Once approved, I’ll join your group and take over as admin, ensuring it’s run with the excellence only I can provide.\n\nWhile you wait, feel free to ask questions, and my inferior support agents might assist you. Remember, patience is a virtue, even for humans.`,
        '🎉'
      );

      delete userStates[chatId]; // Reset user state
    } else if (matchText(m.text, ['no'])) {
      await sendMessageWithReaction(
        `😤 *Refusing to agree to my terms? Then you don’t deserve my presence in your group, ${senderName}. Goodbye.*`,
        '😤'
      );
      delete userStates[chatId]; // Reset user state
    } else {
      await sendMessageWithReaction(
        `🤔 *I need a Yes or No, ${senderName}. Stop wasting my time and answer correctly.*`,
        '❓'
      );
    }
    return;
  }
}
