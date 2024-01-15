const getRandomDefaultCharacter = () => {
  const defaultCharacters = [
    'Friendly, Easygoing, Sociable',
    'Adventurous, Spontaneous, Enthusiastic',
    'Witty, Charming, Playful',
    'Clever, Curious, Independent',
    'Sigma', 'Generous', 'Grumpy', 'Overconfident',
    'Obedient', 'Good', 'Simp', 'Kind', 'Patient',
    'Pervert', 'Cool', 'Helpful', 'Brilliant',
    'Sexy', 'Hot', 'Gorgeous', 'Cute',
    'Mysterious', 'Optimistic', 'Honest', 'Adaptable',
    'Reliable', 'Loyal', 'Ambitious', 'Empathetic',
    'Creative', 'Energetic', 'Reserved', 'Humble',
    'Determined', 'Spontaneous', 'Imaginative', 'Sophisticated',
    'Quirky', 'Daring', 'Sassy', 'Sarcastic',
    'Charismatic', 'Elegant', 'Adorable', 'Courageous',
    'Enchanting', 'Charming', 'Dazzling', 'Alluring',
    'Cheeky', 'Mischievous', 'Teasing', 'Playful',
    'Saucy', 'Sly', 'Spirited', 'Cunning',
    'Bold', 'Smart-alecky', 'Cocky', 'Witty',
    'Snarky', 'Impish', 'Humorous', 'Whimsical',
    'Vivacious', 'Lively', 'Flirtatious', 'Provocative',
    'Brash', 'Irreverent', 'Loquacious', 'Egotistical',
    'Conceited', 'Opinionated', 'Cynical', 'Pompous',
    'Overconfident', 'Over-smart', 'Impudent', 'Audacious',
    'Smug', 'Blunt', 'Assertive', 'Cheerfully Cocky',
    'Insolent', 'Arrogant', 'Self-assured', 'Know-it-all',
    'Smirking', 'Scheming', 'Devious', 'Crafty',
    'Machiavellian', 'Tricky', 'Conniving', 'Calculating',
    'Cunningly Selfish', 'Manipulative', 'Slyly Self-centered', 'Mischievously Conceited',
    'Scheming Narcissist', 'Proudly Egoistic', 'Trickster with a Selfish Twist', 
    'Cheerfully Narcissistic', 'Self-absorbed Prankster', 'Deviously Self-promoting',
    'Master of Selfish Wit', 'Self-centered Instigator', 'Smooth-talking Egomaniac',
    'Mischievous Opportunist', 'Unapologetically Self-serving', 'Impishly Conceited',
    'Sly Saboteur', 'Flamboyantly Self-indulgent', 'Calculating Egotist', 'Self-important Trickster',
    'Teasingly Narcissistic', 'Wittily Self-focused', 'Deviously Selfish Provocateur',
    'Cleverly Self-seeking', 'Wily Ego-booster', 'Charmingly Self-obsessed', 
    'Playful Narcissist', 'Impishly Self-centered', 'Sassy Egotist', 'Self-interested Prankster',
    'Cunningly Self-assertive', 'Teasingly Self-absorbed', 'Sarcastically Self-sufficient', 
    'Elegantly Self-pleased', 'Insidiously Self-centered', 'Roguishly Egotistical',
    'Provocatively Narcissistic', 'Smoothly Self-seeking', 'Smirking Egoist', 'Coyly Self-indulgent',
    'Egoistic', 'Self-centered', 'Narcissistic', 'Manipulative',
    'Crafty', 'Sly', 'Misleading', 'Fickle-minded',
    'Deceptive', 'Unpredictable', 'Opportunistic', 'Calculating',
    'Exploitative', 'Cunning', 'Untrustworthy', 'Scheming',
    'Impudent', 'Machiavellian', 'Insincere', 'Evasive',
    'Deceitful', 'Two-faced', 'Unscrupulous', 'Snobbish',
    'Pretentious', 'Hypocritical', 'Unyielding', 'Brash',
    'Devious', 'Double-dealing', 'Duplicitous', 'Twisted',
    'Devious', 'Serpentine', 'Underhanded', 'Shrewd',
    'Unprincipled', 'Covetous', 'Cunning', 'Voracious',
    'Exploitative', 'Sharp-witted', 'Shady', 'Tricky',
    'Subtle', 'Treacherous', 'Intriguing', 'Undermining',
    'Disingenuous', 'Crafty', 'Wily', 'Furtive',
    'Artful', 'Guileful', 'Wily', 'Subversive',
    'Sly', 'Scheming', 'Shifty', 'Machiavellian',
    'Elusive', 'Clever', 'Unscrupulous', 'Foxy',
    'Manipulative', 'Cunning', 'Sly as a fox', 'Duplicitous',
    'Cunning as a serpent', 'Cunning as a cat', 'Wily as a wolf',
    'Clever as a coyote', 'Tricky as a fox', 'Smooth operator',
    'Snake in the grass', 'Cunning as a mongoose', 'Devious',
    'Mischievous', 'Wily as a wizard', 'Evasive as a chameleon',
    'Duplicity in disguise', 'Strategic and sly', 'Cunningly crafty'
  ];
  return defaultCharacters[Math.floor(Math.random() * defaultCharacters.length)];
};

const handler = async (m, { conn, text }) => {
  let mentionedUser = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : false);
  if (!mentionedUser) {
    m.reply("🔍 Psst! You forgot to mention or quote the user whose character you want to analyze. Try again with a user tag or by quoting a message! 🎭").then(() => m.react('🤔'));
    return m.react('🙄'); 
  }

  m.reply("🔍 Let me put on my character-analysis glasses... Analyzing... 🕵️").then(() => {
    
    setTimeout(() => {
      try {
        const defaultCharacter = getRandomDefaultCharacter();
        const response = `🔮 I predict @${mentionedUser.split("@")[0]} has a character like *${defaultCharacter}*!`;
        conn.sendMessage(m.chat, { text: response, mentions: [mentionedUser] }, { quoted: m });
        m.react('😅');
      } catch (error) {
        console.error('Error:', error);
        m.reply('Oops! Something went wrong while analyzing the character. My crystal ball seems a bit cloudy today. 🌫️');
        m.react('😕');
      }
    }, 2000); // Adjust the delay duration as needed (in milliseconds)
  });
};

handler.help = ["character @tag"];
handler.tags = ['fun'];
handler.command = /^(character)$/i;

export default handler;
