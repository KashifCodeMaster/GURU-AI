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

    const randomLocation = () => pickRandom(['New York', 'Tokyo', 'Paris', 'London', 'Lahore', 'Mumbai', 'Jakarta', 'Lagos', 'Cairo', 'Undisclosed City', 'Mexico City', 'Sillicon Valley', 'Karachi', 'Dhaka', 'Delhi', 'São Paulo']);

    const randomOccupation = () => pickRandom(['Engineer', 'Doctor', 'Teacher', 'Artist', 'Cowboy', 'Student', 'Unemployed', 'Singer']);

    const randomBankBalance = () => (Math.random() * 100000).toFixed(2);

    const generateRandomEmail = (username) => {
      const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
      const randomDomain = pickRandom(domains);
      return `${username.toLowerCase().replace(/[^a-z0-9]/g, '')}@${randomDomain}`;
    };

    const getRandomSearchHistories = () => {
      const searchHistoryList = [
        'Funny cat videos',
        'Best pizza places near me',
        'Popular Animes',
        'Best Animes to watch in 2024',
        'M16 Gun',
        'Creative ways to say I love you',
        'Silver Fox Robot',
        'How to learn English in weird ways',
        'Gifts',
        'How to bake cookies',
        'Travel destinations 2024',
        'Latest movie reviews',
        'Home workout routines',
        'Korean Dramas',
        'Imran Khan',
        'Mia Khalifa',
        'How to hack WhatsApp',
        'ways to protect my device from hacking',
        'How to impress someone without doing anything?',
      ];
      return Array.from({ length: 3 }, () => pickRandom(searchHistoryList)).join(', ');
    };

    if (m.isGroup) {
      if (!m.mentionedJid.length && command !== 'hack group') {
        m.react('🙄');
        m.reply(`🤔 To initiate hacking, mention a user or use the command "${usedPrefix}hack group".`);
        return 
      }

      const victim = m.mentionedJid[0] || m.sender;

      if (command === 'hack group') {
        const groupMetadata = await conn.groupMetadata(m.chat);
        const groupName = groupMetadata.subject || 'Unknown Group';
        m.reply(`🌐 Initiating hacking sequence on all participants of the group *${groupName}*...`);
      } else {
        m.reply(`🕵️‍♂️ Initiating hacking sequence on *@${victim.split("@")[0]}*...`, null, {
          mentions: [victim],
        });
      }
    } else {
      // In private chat (not in a group)
      const victim = m.mentionedJid[0] || m.sender;
      if (command === 'hack group') {
        m.reply(`🚫 The "${usedPrefix}hack group" command can only be used in group chats.`);
      } else {
        m.reply(`🕵️‍♂️ Initiating sophisticated hacking sequence on *@${victim.split("@")[0]}*...`, null, {
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
    "🤷‍♂️ Unforeseen interference from a parallel universe.",
    "🚀 Quantum entanglement disrupted the hacking signal.",
    "🕵️‍♂️ Agent Smith from the Matrix intercepted the connection.",
    "🧠 Sentient system achieved self-awareness; blocked access.",
    "💼 Board meeting in progress; suspicious activity reported.",
    "📡 Signal interference caused by solar flare activity.",
    "🚧 Network congestion due to unexpected high traffic.",
    "🌌 Cosmic rays interfered with the data transmission.",
    "🔍 Forensic analysis initiated; hacker identity traced.",
    "🤯 System administrator accidentally triggered security measures.",
    "🌪️ Cyberstorm detected; system automatically went offline.",
    "👾 Alien technology detected; unauthorized access denied.",
  ];
  m.reply(`🚫 Hacking attempt failed! ${pickRandom(randomExcuses)}`);
  return;
}
    
    const hackingMessages = [
  '💾 Extracting confidential data from target...',
  '🔓 Decrypting sensitive information...',
  '🎉 Successfully breached security!',
  '🚨 Initiating self-destruction of hacking traces...',
  '💥 Erasing all evidence of the hacking operation...',
  '🔥 Destroying compromised server logs...',
  '📡 Closing backdoor access points...',
  '🔒 Securing exit from the hacked system...',
  '🕵️‍♂️ Activating counterintelligence measures...',
  '🔍 Hiding digital footprints to avoid detection...',
];
    
    const hackingGroupMessages = [
  '💾 Extracting confidential data from all group participants...',
  '🔓 Decrypting sensitive information...',
  '🎉 Successfully breached security! All WhatsApp chat history and data of the group members have been collected and can be viewed in the local files.',
  '🚨 Initiating self-destruction of hacking traces to maintain anonymity...',
  '💥 Erasing all evidence of the hacking operation...',
  '🔥 Destroying compromised server logs...',
  '📡 Closing backdoor access points...',
  '🔒 Securing exit from the hacked system...',
  '👥 Group members marked as "Innocent Bystanders" to divert suspicion...',
  '🌐 Broadcasting misinformation to confuse investigation efforts...',
];
        
    const hackingLogMessages = [
      '📈 *Hacking Statistics:*',
      '⏱ *Time Taken:* %time% seconds',
      '📊 *Success Rate:* %successRate%',
      '🌐 *Data Collected:* Personal details, social media access, financial information, search history, contact list, personal files and dossiers',
      '📜 *Hacking Operation Completed:*',
    ];

    const twistMessages = [
  '🔄 A rival hacking group discovered your activities and initiated a counter-hack! Brace for impact!',
  '🔄 The hacking attempt triggered an unexpected security measure; escape immediately!',
  '🔄 Target is an undercover agent; mission just got more complex!',
  '🔄 Hacked data contains a hidden message; decipher to unveil the truth!',
  '🔄 Quantum entanglement caused a temporal anomaly; adapt to the altered reality!',
  '🔄 Artificial intelligence detected your hacking attempt; engage in a virtual battle!',
  '🔄 Unforeseen interference from a parallel universe; watch out for anomalies!',
  '🔄 The target system activated a self-learning defense; prepare for an evolving challenge!',
  '🔄 Mission objective shifted; new intel indicates a high-profile data vault nearby!',
  '🔄 Holographic security projection activated; navigate through illusions carefully!',
];

    const hackingVariations = Math.random();
    if (command === 'hack group') {
      for (const message of hackingGroupMessages) {
        m.reply(message);
        await sleep(5000);
      }
    } else {
      for (const message of hackingMessages) {
        m.reply(message);
        await sleep(4000);
      }
      m.reply('💾 Extracting additional information from personal files...');
      await sleep(3000);
      m.reply('🔍 Scanning social media profiles for more details...');
      await sleep(4000);
      m.reply('🌐 Analyzing online activities and preferences...');
      await sleep(3000);
      m.reply('📜 Compiling comprehensive dossier on the individual...');
      await sleep(5000);

      const victim = m.mentionedJid[0] || m.sender;
      const username = `*@${victim.split("@")[0]}*`;
      const email = generateRandomEmail(username);
      const password = Math.random().toString(36).substring(7); // Generate random password
      const dob = randomDateOfBirth();
      const location = randomLocation();
      const occupation = randomOccupation();
      const bankBalance = randomBankBalance();
      const searchHistory = getRandomSearchHistories();
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
      `, null, {
        mentions: [victim],
      });

      await sleep(3000);
    }

    if (hackingVariations > 0.7) {
      const randomTwist = pickRandom(twistMessages);
      m.reply(randomTwist);
      await sleep(6000);

      if (randomTwist.includes('counter-hack')) {
        m.reply('🚨 Emergency shutdown activated. Initiating escape protocol...');
        await sleep(4000);
        m.reply('🔍 Erasing traces of counter-hack to prevent retaliation...');
        await sleep(4000);
        m.reply('🔒 Successfully evaded counter-hack. Exiting stealthily.');
      }
    } else {
      for (const message of hackingLogMessages) {
        m.reply(message.replace('%time%', ((Date.now() - startTimestamp) / 1000).toFixed(2)).replace('%successRate%', Math.random() > 0.5 ? 'High' : 'Medium'));
        await sleep(2000);
      }
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
