import fetch from 'node-fetch';
import GIFBufferToVideoBuffer from '../lib/Gifbuffer.js';

// Helper function to fetch a buffer from a URL
const getBuffer = async (url) => {
  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer);
  } catch (error) {
    console.error("Failed to get buffer", error);
    throw new Error("Failed to get buffer");
  }
}

// Improved message generator with more aggressive tones
const getRandomMessage = (action, sender, target) => {
  const messageVariations = {
    bully: [
      `(${sender}) slapped ${target} so hard, the earth shook!`,
          `(${sender}) playfully bullied ${target}`,
    `Watch out! (${sender}) just teased ${target}`,
    `(${sender}) threw some friendly banter at ${target}`,
    `(${sender}) pulled a prank on ${target}`,
    `(${sender}) jokingly mocked ${target}`,
    `(${sender}) bullied ${target} so bad, they might cry!`,
    `(${sender}) roasted ${target} like a marshmallow over a fire!`,
    `(${sender}) just dropped a truth bomb on ${target}!`,
    `(${sender}) made fun of ${target} like it was their job!`,
    `(${sender}) put ${target} on blast, and it was savage!`,
      `Whoa! (${sender}) just bullied ${target} like there's no tomorrow.`,
      `(${sender}) went all out and bullied ${target} mercilessly!`,
      `(${sender}) absolutely destroyed ${target} with some next-level teasing.`,
      `(${sender}) threw hands, and ${target} didn't even see it coming!`
    ],
    cuddle: [
      `(${sender}) smothered ${target} in the tightest, warmest cuddle possible!`,
          `(${sender}) gave a warm hug to ${target}`,
    `Aww! (${sender}) cuddled up with ${target}`,
    `Spread the love! (${sender}) shared a comforting cuddle with ${target}`,
    `(${sender}) wrapped ${target} in a cozy embrace`,
    `Warm fuzzies alert! (${sender}) snuggled with ${target}`,
    `(${sender}) tried to cuddle ${target}, but it was just awkward!`,
    `(${sender}) pulled ${target} into a hug they didn’t want!`,
    `(${sender}) attempted to hug ${target}, but it felt like a trap!`,
    `(${sender}) cuddled ${target} so hard, they thought they were suffocating!`,
    `(${sender}) wrapped ${target} up like a burrito—hope they don’t escape!`,
      `(${sender}) suffocated ${target} with an overwhelming amount of affection.`,
      `(${sender}) grabbed ${target} and squeezed the life out of them with a cuddle!`,
      `(${sender}) wrapped ${target} so tightly, they almost couldn’t breathe.`,
      `(${sender}) isn't letting go of ${target} anytime soon, too much love!`
    ],
    cry: [
      `(${sender}) made ${target} bawl their eyes out. Brutal.`,
          `Oh no! (${sender}) made ${target} cry`,
    `(${sender}) shared a tear-jerking moment with ${target}`,
    `Someone get tissues! (${sender}) brought tears to ${target}'s eyes`,
    `(${sender}) played the world's saddest song, making ${target} cry`,
    `(${sender}) recounted a heartbreaking story, leaving ${target} in tears`,
    `(${sender}) just made ${target} sob like a child!`,
    `(${sender}) dropped a reality check on ${target}, and now they're weeping!`,
    `(${sender}) crushed ${target}'s dreams, and the tears flowed!`,
    `(${sender}) hit ${target} with the feels, and it’s a total meltdown!`,
    `(${sender}) made ${target} cry so hard, even the emojis are sad!`,
    `(${sender}) hit ${target} with so much truth, they broke down in tears.`,
      `(${sender}) shattered ${target} emotionally. Someone grab tissues!`,
      `(${sender}) hit ${target} so hard with sadness, they can't stop crying.`,
      `(${sender}) made ${target} sob like a baby. Heartbreaking.`
    ],
    cringe: [
      `(${sender}) and ${target} cringed so hard it hurt.`,
          `(${sender}) and ${target} cringed together at something awkward`,
    `Cringe alert! (${sender}) and ${target} shared a moment of shared cringe`,
    `(${sender}) couldn't help but cringe at the awkward situation with ${target}`,
    `Watch out! (${sender}) and ${target} exchanged cringes at the same time`,
    `(${sender}) and ${target} shared a laugh after the cringe-worthy moment`,
    `(${sender}) just witnessed ${target} do something so cringy, it should be illegal!`,
    `(${sender}) cringed so hard at ${target}'s move, they almost fainted!`,
    `(${sender}) couldn't believe ${target} thought that was cool!`,
    `(${sender}) and ${target} just experienced cringe overload, and it's hilarious!`,
    `(${sender}) facepalmed at ${target}'s awkwardness, and it was epic!`,
      `Cringe overload! (${sender}) made ${target} wish they'd never witnessed that.`,
      `(${sender}) made ${target} cringe so hard they might never recover.`,
      `(${sender}) dragged ${target} into the deepest cringe ever.`,
      `Oof! (${sender}) and ${target} just shared the most awkward moment imaginable.`
    ],
      hug: [
            `(${sender}) gave ${target} a hug so tight, they might need air!`,
    `(${sender}) tried to hug ${target}, but it felt more like a chokehold!`,
    `(${sender}) gave ${target} a hug that was awkwardly long!`,
    `(${sender}) wrapped ${target} in a hug and didn’t let go—hope they like it!`,
    `(${sender}) thought a hug would fix everything—spoiler: it didn’t!`,
    `(${sender}) threw ${target} into a bear hug, and it was a bit much!`,
    `(${sender}) hugged ${target} so tight, it turned into a wrestling match!`,
    `(${sender}) gave ${target} a hug that was so awkward, it could be a meme!`,
    `(${sender}) tried to hug ${target}, but it just got weird!`,
    `(${sender}) went in for a hug, and it was more painful than sweet!`
  ],
      awoo: [
    `(${sender}) let out an awoo so loud, ${target} jumped!`,
    `(${sender}) howled like a wolf, and ${target} just rolled their eyes!`,
    `(${sender}) did a cute awoo, but it was more funny than adorable!`,
    `(${sender}) tried to be cute with an awoo, but it just flopped!`,
    `(${sender}) awoo-ed, and ${target} just cringed!`,
    `(${sender}) awoo-ed like a pro, and ${target} couldn't handle it!`,
    `(${sender}) attempted awoo, but it sounded more like a cat!`,
    `(${sender}) awoo-ed, and it was hilariously awkward!`,
    `(${sender}) did an awoo that made ${target} question their sanity!`,
    `(${sender}) let out a howl, and ${target} couldn't stop laughing!`
  ],
      kiss: [
    `(${sender}) kissed ${target} so unexpectedly, they didn't know what to do!`,
    `(${sender}) went for a kiss, but it was more of a lip bump!`,
    `(${sender}) planted a kiss on ${target} like it was a sticker!`,
    `(${sender}) kissed ${target}, but it was just plain weird!`,
    `(${sender}) aimed for a kiss and got a face full of rejection!`,
    `(${sender}) kissed ${target} so forcefully, it turned into a smack!`,
    `(${sender}) tried to kiss ${target}, but it was more awkward than sweet!`,
    `(${sender}) went for a kiss, and ${target} dodged like a pro!`,
    `(${sender}) tried to sneak a kiss, but ${target} wasn’t having it!`,
    `(${sender}) kissed ${target} so badly, it might haunt their dreams!`
  ],
      lick: [
    `(${sender}) licked ${target} like it was ice cream—gross!`,
    `(${sender}) thought licking ${target} was funny, but it was just weird!`,
    `(${sender}) tried to lick ${target} and totally missed!`,
    `(${sender}) licked ${target} like a puppy, and it was not cute!`,
    `(${sender}) went in for a lick, but ${target} wasn’t ready for that!`,
    `(${sender}) licked ${target}, and it was the most awkward moment ever!`,
    `(${sender}) attempted to lick ${target} like it was a challenge!`,
    `(${sender}) thought licking ${target} would be funny—spoiler: it wasn't!`,
    `(${sender}) licked ${target} and left them questioning everything!`,
    `(${sender}) licked ${target} so randomly, it left everyone confused!`
  ],
      pat: [
    `(${sender}) patted ${target} so hard, they nearly fell over!`,
    `(${sender}) thought a pat on the back was encouraging, but it was just rude!`,
    `(${sender}) patted ${target} like they were a pet!`,
    `(${sender}) gave ${target} a pat that was more of a slap!`,
    `(${sender}) patted ${target} on the head like a child!`,
    `(${sender}) just gave ${target} a condescending pat!`,
    `(${sender}) patted ${target} like they were trying to calm a wild animal!`,
    `(${sender}) thought a pat would be nice, but it was just patronizing!`,
    `(${sender}) patted ${target} like they were in a petting zoo!`,
    `(${sender}) patted ${target} and it felt like a backhanded compliment!`
  ],
      smug: [
    `(${sender}) gave ${target} a smug grin that said it all!`,
    `(${sender}) smirked at ${target} like they just won a gold medal!`,
    `(${sender}) threw a smug look at ${target}, and it was hilarious!`,
    `(${sender}) was so smug, it made ${target} want to punch them!`,
    `(${sender}) looked at ${target} with a smugness that was just annoying!`,
    `(${sender}) gave ${target} the smug treatment, and it was unbearable!`,
    `(${sender}) had that smug look on their face, and ${target} couldn't stand it!`,
    `(${sender}) was so smug, it felt like a challenge to everyone around!`,
    `(${sender}) flashed a smug smile at ${target} and everyone rolled their eyes!`,
    `(${sender}) was so full of themselves, it was hard to watch!`
  ],
      bonk: [
    `(${sender}) bonked ${target} on the head like they were asking for it!`,
    `(${sender}) just gave ${target} a bonk, and it was a total mood killer!`,
    `(${sender}) bonked ${target} so hard, it echoed!`,
    `(${sender}) delivered a bonk that left ${target} seeing stars!`,
    `(${sender}) bonked ${target} on the head, and it was totally uncalled for!`,
    `(${sender}) just bonked ${target}, and everyone felt it!`,
    `(${sender}) thought a bonk was funny, but ${target} did not agree!`,
    `(${sender}) gave ${target} a bonk and it was just plain rude!`,
    `(${sender}) bonked ${target} like it was a sport!`,
    `(${sender}) just bonked ${target} and made everyone cringe!`
  ],
      yeet: [
    `(${sender}) yeeted ${target} out of existence!`,
    `(${sender}) threw ${target} so far they might never come back!`,
    `(${sender}) yeeted ${target} like a ragdoll—ouch!`,
    `(${sender}) yeeted ${target} without a second thought, ruthless!`,
    `(${sender}) just yeeted ${target} into another dimension!`,
    `(${sender}) gave ${target} the strongest yeet of their life, hope they land!`,
    `(${sender}) yeeted ${target} so hard they disappeared!`
  ],
      blush: [
    `(${sender}) made ${target} blush, but it was out of pure embarrassment!`,
    `(${sender}) embarrassed ${target} so much they turned red!`,
    `(${sender}) made ${target} blush like they’ve never been humiliated before!`,
    `(${sender}) made ${target} turn red, and it wasn’t cute—it was awkward!`,
    `(${sender}) made ${target} blush so bad, they wish they could hide!`,
    `(${sender}) turned ${target} into a blushing mess—totally exposed!`,
    `(${sender}) embarrassed ${target} into blushing like crazy!`
  ],
      smile: [
    `(${sender}) forced ${target} to smile through the pain!`,
    `(${sender}) cracked a smile on ${target}'s face, but it wasn't genuine!`,
    `(${sender}) made ${target} smile, but it’s hiding something dark!`,
    `(${sender}) gave ${target} a reason to smile—right before chaos hit!`,
    `(${sender}) made ${target} smile, but it was more of a nervous twitch!`,
    `(${sender}) brought a smile to ${target}'s face... but at what cost?`,
    `(${sender}) made ${target} smile, but it was a smile of regret!`
  ],
      wave: [
    `(${sender}) waved at ${target} like they didn’t even care!`,
    `(${sender}) waved goodbye to ${target}—and it felt permanent!`,
    `(${sender}) waved at ${target} like they were saying goodbye forever!`,
    `(${sender}) waved at ${target} with absolutely no enthusiasm!`,
    `(${sender}) waved ${target} away like they didn’t matter!`,
    `(${sender}) waved at ${target} and made it feel dismissive!`,
    `(${sender}) waved at ${target} like they weren’t worth more than a second glance!`
  ],
      highfive: [
    `(${sender}) high-fived ${target} so hard it stung!`,
    `(${sender}) gave ${target} a high-five that felt more like a slap!`,
    `(${sender}) high-fived ${target} with way too much force—awkward!`,
    `(${sender}) threw a high-five at ${target}, but it was anything but friendly!`,
    `(${sender}) high-fived ${target} so hard it left a mark!`,
    `(${sender}) high-fived ${target} like it was a challenge, not a greeting!`,
    `(${sender}) gave ${target} a high-five that hurt more than it should!`
  ],
      handhold: [
    `(${sender}) grabbed ${target}'s hand way too forcefully!`,
    `(${sender}) held ${target}'s hand, but it felt more like a trap!`,
    `(${sender}) held ${target}'s hand so tight they almost lost circulation!`,
    `(${sender}) held ${target}'s hand but there was nothing soft about it!`,
    `(${sender}) grabbed ${target}'s hand, and it was definitely not romantic!`,
    `(${sender}) held ${target}'s hand like they didn’t want to let go—ever!`,
    `(${sender}) held ${target}'s hand, but it was more controlling than comforting!`
  ],
      nom: [
    `(${sender}) took a bite out of ${target} like a savage!`,
    `(${sender}) nommed on ${target} like they were a snack!`,
    `(${sender}) bit into ${target} without even asking—rude!`,
    `(${sender}) nommed ${target} like they were at a buffet!`,
    `(${sender}) gnawed on ${target} like it was their last meal!`,
    `(${sender}) just took a chunk out of ${target}, no mercy!`,
    `(${sender}) bit down on ${target} like they were nothing!`
  ],
      bite: [
    `(${sender}) bit ${target} so hard it left a mark!`,
    `(${sender}) took a massive bite out of ${target} without warning!`,
    `(${sender}) bit ${target} and it was anything but playful!`,
    `(${sender}) sank their teeth into ${target} like a wild animal!`,
    `(${sender}) bit ${target} and it definitely hurt!`,
    `(${sender}) bit ${target} so bad, they probably need a doctor!`,
    `(${sender}) just chomped down on ${target}, no holding back!`
  ],
      glomp: [
    `(${sender}) glomped ${target} so hard they nearly knocked them over!`,
    `(${sender}) just glomped ${target}, and it was way too aggressive!`,
    `(${sender}) tackled ${target} with a glomp, totally uncalled for!`,
    `(${sender}) glomped ${target} like they hadn’t seen them in years!`,
    `(${sender}) glomped ${target} and left them dazed!`,
    `(${sender}) glomped ${target} with way too much energy!`,
    `(${sender}) just glomped ${target}, leaving them confused and out of breath!`
  ],
  slap: [
    `(${sender}) slapped ${target} so hard they saw stars!`,
    `(${sender}) just slapped ${target} like they meant business!`,
    `(${sender}) gave ${target} a slap that echoed across the room!`,
    `(${sender}) slapped ${target} so hard their face might still be stinging!`,
    `(${sender}) slapped ${target} with absolutely no warning!`,
    `(${sender}) slapped ${target} and didn’t hold back—at all!`,
    `(${sender}) slapped ${target} like they were settling a score!`
  ],
  kill: [
    `(${sender}) absolutely annihilated ${target}!`,
    `(${sender}) just destroyed ${target}, no mercy!`,
    `(${sender}) eliminated ${target} from existence!`,
    `(${sender}) went all out and killed ${target} without hesitation!`,
    `(${sender}) took down ${target} like they were nothing!`,
    `(${sender}) just finished ${target}, no questions asked!`,
    `(${sender}) obliterated ${target} with no second thoughts!`
  ],
  happy: [
    `(${sender}) made ${target} happy, but it felt suspiciously forced!`,
    `(${sender}) made ${target} smile, but they’re secretly plotting revenge!`,
    `(${sender}) cheered up ${target}, but it came with a price!`,
    `(${sender}) made ${target} laugh, but they’ll regret it later!`,
    `(${sender}) made ${target} happy, but is that happiness hiding something darker?`,
    `(${sender}) brought joy to ${target}, but at what cost?`,
    `(${sender}) made ${target} laugh, but it felt... off!`
  ],
  wink: [
    `(${sender}) winked at ${target} and it was downright suspicious!`,
    `(${sender}) gave ${target} a wink that felt way too intense!`,
    `(${sender}) winked at ${target}, but it was more unsettling than charming!`,
    `(${sender}) threw a wink at ${target}, and now they don’t know what to think!`,
    `(${sender}) winked at ${target}, but it didn’t feel friendly—it felt ominous!`,
    `(${sender}) winked at ${target} like they were plotting something!`,
    `(${sender}) winked at ${target}, and now everything feels weird!`
  ],
  poke: [
    `(${sender}) poked ${target} so hard it left a bruise!`,
    `(${sender}) just poked ${target} way too aggressively!`,
    `(${sender}) poked ${target} like they were trying to start something!`,
    `(${sender}) jabbed ${target} with a poke that definitely hurt!`,
    `(${sender}) poked ${target} with absolutely no chill!`,
    `(${sender}) poked ${target} and it wasn’t playful at all!`,
    `(${sender}) poked ${target} with enough force to knock them over!`
  ],
  dance: [
    `(${sender}) forced ${target} to dance like it was life or death!`,
    `(${sender}) made ${target} dance like their life depended on it!`,
    `(${sender}) just dragged ${target} onto the dance floor without asking!`,
    `(${sender}) made ${target} dance so hard they can’t feel their legs!`,
    `(${sender}) made ${target} dance like a puppet on strings`,
    `(${sender}) forced ${target} to dance like it was a life-or-death situation!`,
    `(${sender}) made ${target} dance like their life depended on it!`,
    `(${sender}) dragged ${target} onto the dance floor without any warning!`,
    `(${sender}) got ${target} to dance so hard, they might need a stretcher!`,
    `(${sender}) pushed ${target} to dance like a puppet on strings—so awkward!`,
    `(${sender}) made ${target} dance like no one was watching, but everyone was!`,
    `(${sender}) got ${target} to bust a move that left everyone cringing!`
  ],
    scream: [
    `(${sender}) made ${target} scream like they just saw a ghost!`,
    `(${sender}) scared ${target} so bad, they let out a blood-curdling scream!`,
    `(${sender}) provoked ${target} into a scream that echoed through the room!`,
    `(${sender}) sent shivers down ${target}'s spine with that scare!`,
    `(${sender}) just made ${target} scream like they were in a horror movie!`,
    `(${sender}) got ${target} to scream, and it was both hilarious and terrifying!`,
    `(${sender}) unleashed a scream from ${target} that left everyone stunned!`
  ],
  pout: [
    `(${sender}) made ${target} pout like a kid denied candy!`,
    `(${sender}) saw ${target} pouting and couldn’t help but laugh!`,
    `(${sender}) got ${target} to pout so adorably, it was impossible to resist!`,
    `(${sender}) pushed ${target} into a pout that was both cute and annoying!`,
    `(${sender}) just couldn't deal with ${target}'s pouty face anymore!`,
    `(${sender}) watched ${target} pout and felt a mix of amusement and pity!`,
    `(${sender}) made ${target} pout, and it was utterly ridiculous!`
  ],
  tease: [
    `(${sender}) teased ${target} relentlessly, and it was kind of brutal!`,
    `(${sender}) couldn't resist teasing ${target}—it was too easy!`,
    `(${sender}) playfully teased ${target}, but it hit a bit too close to home!`,
    `(${sender}) teased ${target} so much they almost cried from laughter!`,
    `(${sender}) made ${target} the butt of the joke, and it was savage!`,
    `(${sender}) gave ${target} a teasing grin that screamed mischief!`,
    `(${sender}) pushed all of ${target}'s buttons with relentless teasing!`
  ],
      sigh: [
    `(${sender}) sighed dramatically at ${target}'s antics!`,
    `(${sender}) let out a long sigh that said it all to ${target}!`,
    `(${sender}) sighed so deeply, it felt like a weight was lifted!`,
    `(${sender}) made ${target} feel the impact of that heavy sigh!`,
    `(${sender}) sighed, and it resonated with the depth of their frustration!`,
    `(${sender}) couldn’t help but sigh at ${target}'s ridiculousness!`,
    `(${sender}) sighed heavily, and ${target} knew they messed up!`
  ],
  };

  const variations = messageVariations[action];
  if (!variations || variations.length === 0) {
    return ''; // Return an empty string if the action is not recognized
  }

  const randomIndex = Math.floor(Math.random() * variations.length);
  return variations[randomIndex];
};

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let who;

  // Fetch the target user from either mention or quoted message
  if (m.isGroup) {
    who = m.mentionedJid[0] || (m.quoted && m.quoted.sender) || false;
  } else {
    who = m.chat;
  }

  if (!who) throw `🤦🏻‍♀️ You need to mention or quote someone to target them!\n\n📌 Example: ${usedPrefix + command} @tag`;

  let targetName = who ? conn.getName(who) : ''; // Fetch the target's name
  let senderName = conn.getName(m.sender); // Fetch the sender's name

  // React to the command with a waiting emoji
  m.react('⏳');

  // Fetch a GIF for the reaction from the API
  let reaction = await fetch(`https://api.waifu.pics/sfw/${command}`);
  if (!reaction.ok) throw await reaction.text();

  let json = await reaction.json();
  let { url } = json;

  // Convert GIF buffer to video buffer
  const gifBuffer = await getBuffer(url);
  const gifToVideoBuffer = await GIFBufferToVideoBuffer(gifBuffer);

  // Generate the appropriate message
  const message = getRandomMessage(command, senderName, targetName);

  // Send the reaction message with the video
  await conn.sendMessage(
    m.chat,
    { video: gifToVideoBuffer, caption: message, gifPlayback: true, gifAttribution: 0 },
    { quoted: m }
  );

  // React with a happy emoji after sending
  m.react('☺️');
};

// Handler properties for the reaction commands
handler.tags = ['reaction'];
handler.help = [
  'bully @tag',
  'cuddle @tag',
  'cry @tag',
  'hug @tag',
  'awoo @tag',
  'kiss @tag',
  'lick @tag',
  'pat @tag',
  'smug @tag',
  'bonk @tag',
  'yeet @tag',
  'blush @tag',
  'smile @tag',
  'wave @tag',
  'highfive @tag',
  'handhold @tag',
  'nom @tag',
  'bite @tag',
  'glomp @tag',
  'slap @tag',
  'kill @tag',
  'happy @tag',
  'wink @tag',
  'poke @tag',
  'dance @tag',
  'cringe @tag',
  'scream @tag',
  'pout @tag',
  'sigh @tag',
  'tease @tag'
];

handler.command = /^(bully|cuddle|cry|hug|awoo|kiss|lick|pat|smug|bonk|sigh|scream|pout|tease|yeet|blush|smile|wave|highfive|handhold|nom|bite|glomp|slap|kill|happy|wink|poke|dance|cringe)$/i;
handler.group = true;

export default handler;
