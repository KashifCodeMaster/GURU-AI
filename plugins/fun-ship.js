let toM = a => '@' + a.split('@')[0]

function handler(m, { groupMetadata, conn }) {
    let ps = groupMetadata.participants.map(v => v.id)
    let a = m.sender
    let b

    // Ensure the ship pairs the sender with someone else
    do b = ps.getRandom()
    while (b === a)

    // Building suspense with playful, humorous, and refined pre-ship messages
    const preShipMessages = [
        `🔮 *Well, well, well... what do we have here?* Looks like the matchmaking universe has a surprise for ${toM(a)}. *Brace yourselves for what’s about to happen...* 🧑‍🚀💫`,
        `💌 *I sense love in the air...* Or maybe it’s just the sweet scent of chaos? Either way, ${toM(a)}, things are about to get *interesting*! 😏 Who’s going to join you in this romantic adventure?`,
        `🎬 *Lights, camera, action!* It's time for today's most awaited love drama starring... ${toM(a)}! *But who's the mysterious co-star?* 🤔 Grab your popcorn and stay tuned... 🍿`,
        `✨ *Hey, @everyone,* I’ve got some *delicious gossip* for you. It seems that ${toM(a)} is about to be shipped! Who’s going to be the lucky one? Let’s watch this *epic love tale unfold*...`,
        `⚡ *ALERT! SHIP INCOMING! WARNING!* 🚨 ${toM(a)} is about to experience a *wild romantic twist!* Could this be *true love*... or just *chaos in disguise*? Let’s find out!`,
        `💫 *Welcome to the Love Show!* Tonight’s episode features ${toM(a)} in a *surprising* and maybe *questionable* ship. Who will be the *lucky partner*? Stay tuned to see how this *saga unfolds*...`,
        `📢 *BREAKING NEWS!* ${toM(a)} is about to be paired with someone... but is it destiny or disaster? Let’s just say, the group is in for *one heck of a show!* Stay with us!`,
        `🌪️ *Attention!* ${toM(a)} is about to be swept off their feet... But with whom? *Prepare for some unexpected romantic turbulence!* Will it be sweet or chaotic? Let’s see! 🍬💥`
    ]

    // Post-shipping messages with even more humor, romance, drama, and fun twists
    const shipMessages = [
        `💘 ${toM(a)} ❣️ ${toM(b)} 💘\n*Oh wow, this is it!* *The pairing we’ve all been waiting for!* 💖\n💬 *"Well, folks, it looks like ${toM(a)} and ${toM(b)} are about to embark on the most *unexpected* love journey."* Buckle up! 🚀`,
        `💞 ${toM(a)} ❣️ ${toM(b)} 💞\n*And we have a match!* *Destiny has spoken.* 💫\n💬 *"Are we about to witness the greatest love story of our time... or a total romantic disaster?* Either way, we’re all here for it!" 🍿`,
        `💓 ${toM(a)} ❣️ ${toM(b)} 💓\n*Oooh la la!* This just got *spicy!* 🔥\n💬 *"The sparks are flying, but is it love or pure chaos?"* Let’s sit back and watch this *unpredictable* pairing unfold. 🧨`,
        `💖 ${toM(a)} ❣️ ${toM(b)} 💖\n*Hold on to your hearts!* 💓 *The ultimate match has arrived.* 💘\n💬 *"What’s next for this power duo? Will it be butterflies or firecrackers?* Either way, *drama* is on the horizon!"`,
        `💕 ${toM(a)} ❣️ ${toM(b)} 💕\n*Cupid strikes again!* 🏹💘 *This pairing is going to be one for the books!*\n💬 *"Romantic comedies? Nah, this is a full-blown rom-com drama. Get ready for the wild ride!"* 🎢`,
        `❤️ ${toM(a)} ❣️ ${toM(b)} ❤️\n*Well, well, well... look at what we have here!* 💌 *Looks like romance has found its way into this group.*\n💬 *"Whether it’s true love or utter chaos... one thing is certain: we’re entertained!"*`,
        `💟 ${toM(a)} ❣️ ${toM(b)} 💟\n*Here comes trouble!* Or maybe... *true love?* 💖\n💬 *"Either way, sparks are flying! Is this about to be the group’s next iconic love story, or an epic disaster?"* 🔥`,
        `💗 ${toM(a)} ❣️ ${toM(b)} 💗\n*This is the love drama we didn’t know we needed!* 💖\n💬 *"Will ${toM(a)} and ${toM(b)} steal the spotlight, or just steal our laughs?"* This one’s going to be *epic.*`
    ]

    // Adding more surprise twists for extra fun and unpredictability
    const shipTwists = [
        `🔥 *Uh-oh!* Looks like ${toM(b)} has a *secret admirer* in the group... and it’s *not* ${toM(a)}. This just got *awkward*! 😳`,
        `👀 *Wait a minute...* Did ${toM(b)} just *accidentally confess* their feelings for someone *else*? Oh no, this love triangle is about to get messy! 💔`,
        `💀 *Plot twist!* ${toM(a)}'s *ex* just popped into the chat... and let’s just say, they’re *not happy*. Cue the drama! 🍿`,
        `🌪️ *Sudden shocker!* Turns out ${toM(b)} has been *stalking* ${toM(a)} on social media... but they didn’t think it would come to this! Yikes!`,
        `🎉 *Surprise, surprise!* Guess what? ${toM(a)} and ${toM(b)} have secretly been crushing on each other this whole time. The plot thickens! 🥰`,
        `😏 *Oooh... did anyone else catch that?* ${toM(b)} just whispered something... and it definitely wasn’t “friendship.” Let the sparks fly! 💋`,
        `💔 *Incoming heartbreak!* ${toM(a)} seems to have *ghosted* ${toM(b)} already... This ship might be *sinking fast!* 🚢`,
        `🧐 *Uh-oh...* Looks like ${toM(b)} has *other plans* tonight. Seems like this ship might need to *reschedule* its departure. 🛳️`
    ]

    // React with excitement before shipping
    m.react('🎯')

    // Send the pre-shipping message with extra flair
    conn.sendMessage(m.chat, preShipMessages[Math.floor(Math.random() * preShipMessages.length)], { mentions: [a] })

    // Wait longer for more suspense, then send the ship result and twist
    setTimeout(() => {
        m.react('💘') // Heart emoji reaction once shipping is complete
        let shipMessage = shipMessages[Math.floor(Math.random() * shipMessages.length)]
        let twist = Math.random() > 0.6 ? shipTwists[Math.floor(Math.random() * shipTwists.length)] : ''
        m.reply(`${shipMessage}\n${twist}`, null, {
            mentions: [a, b]
        })
    }, 5000) // Increased delay to 5 seconds for more dramatic buildup!
}

handler.help = ['ship']
handler.tags = ['fun']
handler.command = ['ship']

handler.group = true

export default handler
        
