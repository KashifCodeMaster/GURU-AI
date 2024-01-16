const handler = async (m, { conn, command, usedPrefix }) => {
  try {
    const startTimestamp = Date.now();

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const pickRandom = (list) => list[Math.floor(Math.random() * list.length)];

    const randomDateOfBirth = () => {
      const year = Math.floor(Math.random() * (2000 - 1950 + 1) + 1950);
      const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
      const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const randomLocation = () => pickRandom(['City A', 'City B', 'City C', 'City D']);

    const randomOccupation = () => pickRandom(['Engineer', 'Doctor', 'Teacher', 'Artist']);

    const randomBankBalance = () => (Math.random() * 100000).toFixed(2);

    if (m.isGroup) {
      if (!m.mentionedJid.length && command !== 'hack group') {
        m.reply(`🤔 To initiate hacking, mention a user or use the command "${usedPrefix}hack group".`);
        return m.react('🙄');
      }

      const victim = m.mentionedJid[0] || m.sender;

      if (command === 'hack group') {
        const groupMetadata = await conn.groupMetadata(m.chat);
        const groupName = groupMetadata.subject || 'Unknown Group';
        m.reply(`🌐 Initiating hacking sequence on all participants of the group *${groupName}*...`);
      } else {
        m.reply(`🕵️‍♂️ Initiating hacking sequence on *@${conn.getName(victim)}*...`, null, {
          mentions: [victim],
        });
      }
    } else {
      // In private chat (not in a group)
      const victim = m.mentionedJid[0] || m.sender;
      if (command === 'hack group') {
        m.reply(`🚫 The "${usedPrefix}hack group" command can only be used in group chats.`);
      } else {
        m.reply(`🕵️‍♂️ Initiating sophisticated hacking sequence on *@${conn.getName(victim)}*...`, null, {
          mentions: [victim],
        });
      }
    }

    await sleep(3000);
    const hackingSuccess = Math.random() > 0.3; // 70% success rate, 30% failure

    if (!hackingSuccess) {
      const randomExcuses = [
        "🔐 Target system encrypted with quantum algorithms.",
        "⚠️ Security protocols upgraded; hacking thwarted.",
        "🤖 AI defense system activated; mission aborted.",
        "🚨 System detected intrusion attempt; initiating lockdown.",
        "🌐 Target server temporarily offline for maintenance.",
        "🛡️ Strong firewall defenses detected; hacking failed.",
      ];
      m.reply(`🚫 Hacking attempt failed! ${pickRandom(randomExcuses)}`);
      return;
    }

    if (command === 'hack group') {
      m.reply('💾 Extracting confidential data from all group participants...');
      await sleep(5000);
      m.reply('🔓 Decrypting sensitive information...');
      await sleep(4000);
      m.reply('🎉 Successfully breached security! All WhatsApp chat history and data of the group members have been collected and can be viewed in the local files.');
      await sleep(3000);
      m.reply('🚨 Initiating self-destruction of hacking traces to maintain anonymity...');
      await sleep(4000);
      m.reply('💥 Erasing all evidence of the hacking operation...');
      await sleep(3000);
      m.reply('🔥 Destroying compromised server logs...');
      await sleep(3000);
      m.reply('📡 Closing backdoor access points...');
      await sleep(4000);
      m.reply('🔒 Securing exit from the hacked system...');
      await sleep(3000);

      const twistChance = Math.random();
      if (twistChance > 0.7) {
        m.reply('🔄 Unexpected plot twist: A rival hacking group discovered your activities and initiated a counter-hack! Brace for impact!');
        await sleep(6000);
        m.reply('🚨 Emergency shutdown activated. Initiating escape protocol...');
        await sleep(4000);
        m.reply('🔍 Erasing traces of counter-hack to prevent retaliation...');
        await sleep(4000);
        m.reply('🔒 Successfully evaded counter-hack. Exiting stealthily.');
      } else {
        m.reply('🎭 Hacking operation completed. Group details sent. Exiting stealthily.');
      }
    } else {
      m.reply('🔍 Initiating reconnaissance to gather information on the individual...');
      await sleep(4000);
      m.reply('🎭 Evading detection by target’s cybersecurity systems...');
      await sleep(3000);
      m.reply('🌐 Infiltrating social media profiles to gather additional data...');
      await sleep(5000);
      m.reply('🔑 Decrypting private messages for hidden insights...');
      await sleep(4000);
      m.reply('💾 Extracting personal files for in-depth analysis...');
      await sleep(4000);

      const twistChance = Math.random();
      if (twistChance > 0.7) {
        m.reply('🔄 Unexpected plot twist: Target is an undercover agent; mission just got more complex!');
        await sleep(6000);
        m.reply('🚨 Warning: Increased risk of exposure. Proceed with caution...');
        await sleep(4000);
        m.reply('📡 Initiating secure communication channel to gather intel on the undercover agent...');
        await sleep(4000);
        m.reply('🕵️‍♂️ Successfully established secure channel. Continuing with hacking operation.');
      } else {
        m.reply('💾 Extracting additional information from personal files...');
        await sleep(3000);
        m.reply('🔍 Scanning social media profiles for more details...');
        await sleep(4000);
        m.reply('🌐 Analyzing online activities and preferences...');
        await sleep(3000);
        m.reply('📜 Compiling comprehensive dossier on the individual...');
        await sleep(5000);
      }

      const victim = m.mentionedJid[0] || m.sender;
      const username = conn.getName(victim);
      const email = `${username.toLowerCase().replace(/[^a-z0-9]/g, '')}@confidentialmail.com`;
      const password = Math.random().toString(36).substring(7); // Generate random password
      const dob = randomDateOfBirth();
      const location = randomLocation();
      const occupation = randomOccupation();
      const bankBalance = randomBankBalance();
      const searchHistory = Array.from({ length: 5 }, () => faker.lorem.words()).join(', ');
      const contactList = Array.from({ length: 5 }, () => conn.getName(conn.user.jid)).join(', ');

      m.reply(`
👤 *Username:* ${username}
📧 *Email:* ${email}
🔒 *Password:* ${password}
📅 *Date of Birth:* ${dob}
📍 *Location:* ${location}
🏢 *Occupation:* ${occupation}
🌐 *Social Media Access:* Granted
💳 *Bank Balance:* ${bankBalance}
🔍 *Search History:* ${searchHistory}
📞 *Contact List:* ${contactList}
      `);

      await sleep(3000);
      const endTimestamp = Date.now();
      const timeTaken = ((endTimestamp - startTimestamp) / 1000).toFixed(2);
      const successRate = Math.random() > 0.5 ? 'High' : 'Medium';
      const hackingLog = `
📈 *Hacking Statistics:*
⏱ *Time Taken:* ${timeTaken} seconds
📊 *Success Rate:* ${successRate}
🌐 *Data Collected:* Personal details, social media access, financial information, search history, contact list, personal files and dossiers
📜 *Hacking Operation Completed:*
`;
      m.reply(hackingLog);
    }
  } catch (error) {
    console.error('Error during hacking simulation:', error);
    m.reply('😵 Oops! Something went wrong during the hacking simulation.');
  }
};

handler.help = ['hack @tag', 'hack group'];
handler.tags = ['fun'];
handler.command = /^(hack)$/i;

export default handler;
        
