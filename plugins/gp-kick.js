let handler = async (m, { conn, participants, usedPrefix, command }) => {
    let kickUsage = `👀 Whoosh! It seems you forgot to tag or quote the user you want to kick.
    `;

    // Check if the command is used with a mentioned user or a quoted message
    if (!m.mentionedJid[0] && !m.quoted) {
        m.react('🤔');
	m.reply(kickUsage, m.chat, { mentions: conn.parseMention(kickUsage) });
        return;
    }

    // Get the user to be kicked (prioritize mentioned user over quoted)
    let user = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null);

    // List of funny messages to be randomly picked
    const funnyMessages = [
        `🚀 Preparing to launch @${user.split('@')[0]} to the digital universe... and voilà, they're gone! 🌌`,
        `🕊️ Sending @${user.split('@')[0]} on a swift journey to the land of kicked users. Bon voyage! 🚀`,
        `👋 Adiós, @${user.split('@')[0]}! Maybe next time read the rules?`,
	`🚨 Emergency broadcast! @${user.split('@')[0]} has been successfully removed. Please resume your regularly scheduled chatting, now with 100% less unnecessary noise. 📻`,
	`🚀 Buckle up, @${user.split('@')[0]}! We're initiating a rocket-powered ejection. Destination: Kicked Orbit! 🌌`,
        `🧠 Hey @${user.split('@')[0]}, it’s not that we don’t appreciate your unique perspective—it’s just that your “unique perspective” is like bringing a kazoo to a Beethoven concert. No one asked for it, no one likes it, and now you’ve been escorted out by security. Auf Wiedersehen! 🎶`,
        `📜 Once upon a time, there was a user named @${user.split('@')[0]} who thought rules were mere suggestions. Spoiler alert: this fairy tale doesn’t have a happy ending. You’re not the hero, you’re not the sidekick—you’re the random villager who got exiled. Goodbye, and may your next group tolerate your nonsense. 📖`,
        `🔮 Let me consult my crystal ball... oh, look! It’s @${user.split('@')[0]}, forever wandering through WhatsApp groups, leaving a trail of chaos wherever they go. The prophecy was clear: "Remove them before they ruin everything!" And so it is done. Farewell, misfit. 🪄`,
        `🌌 If ignorance were a galaxy, @${user.split('@')[0]} would be its brightest star. Unfortunately, we’re not equipped to navigate such an infinite void of nonsense, so we’ve decided to eject you from this group and let you shine *somewhere else*. Good luck out there, space cadet! 🚀`,
        `🎩 You thought you were the star of the show, didn’t you, @${user.split('@')[0]}? Well, newsflash: this isn’t your circus, and we’re all fresh out of peanuts for your clown act. Time to pack up your unicycle and wobble off into the sunset. Don’t trip on the way out! 🤡`,
        `💔 Let’s break this down, @${user.split('@')[0]}. It’s not us; it’s you. Actually, no, it is us—we simply can’t handle your unbearable presence anymore. The group is like a beautiful garden, and you’re that one weed no one asked for. Consider this your final pruning. Snip, snip! 🌱`,
        `📉 Here’s a stock update for you, @${user.split('@')[0]}: your value in this group has plummeted to below zero. Investors are pulling out, the market is crashing, and we’re declaring bankruptcy on your nonsense. Please pack your things and leave before security escorts you out. 📊`,
        `// Initializing ejection sequence for @${user.split('@')[0]}... Goodbye and good riddance. // SYSTEM STATUS: SUCCESS. 🔴`,
        `// BOOTING UP THE KICKER... @${user.split('@')[0]}, you're about to be processed. // SYSTEM STATUS: KICK COMPLETED. 🤖`,
        `// WARNING: @${user.split('@')[0]} has overstayed their welcome. Ejection in 3... 2... 1... // STATUS: KICK ENGAGED. ✅`,
        `// SYSTEM LOG: @${user.split('@')[0]} is no longer part of the group. Error: No regrets. // ERROR CODE: PEACE OUT. 💥`,
        `// KICKING IN PROGRESS... Step 1: press the button. Step 2: Watch them disappear. Step 3: Smile. // STATUS: SUCCESS. 🌟`,
        `📝 A gentle tap, a swift swipe, and @${user.split('@')[0]} is out the door—no need for goodbye, just an efficient exit. 🏃‍♂️`,
        `🚪 I open the door with a flourish... but it’s not a welcome. It’s a swift, no-nonsense ejection. @${user.split('@')[0]}, please leave your belongings behind. 🧳`,
        `🎤 "And now, ladies and gentlemen, the moment you've all been waiting for. @${user.split('@')[0]}, it’s time for your grand exit!"`,
        `🎯 Precision admin work—1 click, 1 kick, 1 perfect exit. @${user.split('@')[0]}, don't forget to close the door on your way out. 👋`,
        `🧨 Oh, look. A fuse is burning. The countdown has begun for @${user.split('@')[0]}. One more second... and BOOM! Disconnected. 💥`,
        `🖋️ *A short poem for @${user.split('@')[0]}*  
        Goodbye, dear user, it’s time to go,  
        We’ve had our fun, but now it’s time for the show.  
        One swift click, and you’re out, you see,  
        Like a ghost in the wind, just history to me. 👻`,
        `// Kicking @${user.split('@')[0]} with style. // SYSTEM STATUS: SUCCESSFUL REMOVAL. 👏`,
        `🗡️ No words, just action. One swift kick and @${user.split('@')[0]} is out, flying into oblivion. They’ll never know what hit them. 🛸`,
        `💥 A quick jab, a firm click, and @${user.split('@')[0]} is outta here. No drama. Just... physics. ⚡`,
        `// Admin log: @${user.split('@')[0]} kicked out. // SYSTEM LOG: Group cleanliness restored. 🌈`,
        `📜 *A poetic farewell*  
        You entered with hopes, but left in disgrace,  
        A swift admin strike, and now you're out of the race.  
        No pain, no sorrow, just a fleeting trace,  
        Goodbye forever, just space, space, space. 🚀`,
        `🧰 Tools activated. @${user.split('@')[0]}—removed and archived. Group functionality now at 100%. 😌`,
        `⚡ Zap. Bang. POW. @${user.split('@')[0]} is gone—like dust in the wind. No goodbyes, no lingering. Just silence. 🌪️`,
        `💬 *Short message for @${user.split('@')[0]}*  
        You were a brief whisper in the breeze,  
        But now, you're gone. The group is at ease.  
        No need to thank me—just enjoy the peace. 🌱`,
        `🦸‍♂️ Admin superhero to the rescue, banishing @${user.split('@')[0]} with nothing but sheer willpower. Exit, stage left! 🎭`,
        `// Admin command initiated. // @${user.split('@')[0]}—goodbye forever. Enjoy your trip to irrelevance. 🚀`,
        `🖤 *Poem for @${user.split('@')[0]}*  
        A footstep, then silence, a door that swings,  
        You're gone now, like forgotten things.  
        I’ll never miss the chaos you bring,  
        Goodbye, @${user.split('@')[0]}, no need for a ring. 💍`,
        `⚙️ Kick engaged! @${user.split('@')[0]} is now offline, never to darken our chat again. I call that a win. 🏆`,
        `🍂 Fall leaves, swift winds, and @${user.split('@')[0]} caught in the gust. They’re gone, swept away without a trace. 🌪️`,
        `📡 *System update complete.* @${user.split('@')[0]} has been ejected. Enjoy your freefall into obscurity. 🕳️`,
        `🗝️ A quick click, a smooth exit. No fanfare, no cheers. @${user.split('@')[0]} is gone. Simple as that. 🔓`,
	`🎢 Life’s a rollercoaster, @${user.split('@')[0]}, and you just hit the part where it goes straight down. Except this isn’t an amusement park—it’s the admin panel, and the “eject” button is my favorite ride. No refunds, no re-entry, and no one misses you. Bye-bye now! 🎠`,
        `🐌 Oh, @${user.split('@')[0]}, your contribution to this group has been slower than a snail trying to climb Mount Everest. In fact, it’s not just slow—it’s utterly useless. Consider this your gentle push off the mountain. Gravity will take care of the rest. 🏔️`,
        `📡 Breaking news: @${user.split('@')[0]} has officially been classified as a disturbance to group harmony. We’re cutting the signal, changing the channel, and blocking the frequency. Don’t call us—we won’t call you. Over and out! 📺`,
        `🧹 Time to clean up, and @${user.split('@')[0]}, you’re the mess we’ve been meaning to take out. You’ve left crumbs of nonsense all over the place, and honestly, the group deserves better. Consider yourself swept out the door. Don’t let the dustpan hit you on the way out. 🧽`,
        `⚖️ Order in the court! @${user.split('@')[0]}, you’ve been found guilty of crimes against good vibes and sentenced to exile. The jury was unanimous, the judge was ruthless, and the executioner (that’s me) didn’t even blink. Your appeal has been denied. Case closed! 👨‍⚖️`,
        `💡 Did you think your input here was enlightening, @${user.split('@')[0]}? Because it’s been more like a flickering bulb in a haunted house—annoying, distracting, and kind of creepy. Time to turn you off for good. Lights out! 💡`,
        `🚧 Attention, group! We’re under construction to improve vibes and community spirit. Unfortunately, @${user.split('@')[0]} is a hazard to the process. For safety reasons, they’ve been removed from the site. Hard hat not included. Bye now! 🏗️`,
        `🎤 Mic check, @${user.split('@')[0]}... oh wait, your mic’s been permanently muted. Turns out, the group couldn’t bear another second of your off-key karaoke of opinions. No encore, no applause, just a big, beautiful exit. Take a bow! 🎵`,
        `🐟 You’re like a fish out of water here, @${user.split('@')[0]}—flopping around aimlessly and annoying everyone nearby. Instead of putting you back in the water, we’ve decided to let nature take its course. Farewell, fishy. 🐠`,
        `🍯 You thought you were the bee’s knees, @${user.split('@')[0]}, but you’ve been more of a wasp—buzzing around, stinging people with bad takes, and being an overall nuisance. Consider yourself swatted. 🐝`,
        `🎨 Art critic mode: @${user.split('@')[0]}, your contributions to this group are like a stick figure drawn by a toddler—uninspired, messy, and utterly pointless. We’re taking this “masterpiece” off the wall. Goodbye, and take your crayons with you. 🖍️`,
        `🔫 Bang, bang, @${user.split('@')[0]}! You’ve been shot out of this group like the bad decision you are. The wild west doesn’t have room for rule-breakers, and neither do we. Ride off into the sunset, partner! 🤠`,
        `🚗 This group is like a smooth-running car, and @${user.split('@')[0]} is the flat tire slowing us down. We’ve called the tow truck, and they’ll be taking you far, far away. Good luck finding a new vehicle to ruin. 🛞`,
        `🎢 Congratulations, @${user.split('@')[0]}! You’ve just won a lifetime pass... to groups that tolerate nonsense. Sadly, this isn’t one of them. Please take your bad vibes and enjoy the ride somewhere else. 🎡`,
        `🍿 Grab your popcorn, folks! @${user.split('@')[0]}’s time in this group has been a tragicomedy—equal parts cringe and chaos. Unfortunately, this show is canceled. The audience demands better entertainment. 👏`,
        `👑 You thought you were royalty, @${user.split('@')[0]}, but let’s be real—you’re more like the court jester, and not even a funny one. The kingdom has spoken, and you’re banished. Don’t come crawling back to the castle! 👑`,
        `🌈 Oh, sweet @${user.split('@')[0]}, you tried so hard to be the rainbow in this group, but you ended up being a gray cloud of bad takes. Time to rain on someone else’s parade. ☔`,
        `🔧 This group is like a finely tuned machine, and @${user.split('@')[0]} is the rusty cog making it screech. We’ve done some maintenance and removed the problem. Smooth sailing from here! 🛠️`,  
	`🌟 Breaking news: @${user.split('@')[0]} has been voted off the island of this chat. Castaway vibes, anyone? 🏝️`,
        `🚪 @${user.split('@')[0]}, the exit door has been elegantly opened for you. Enjoy your stroll out of the group! 👋`,
        `🤔 Did someone order a group shake-up? Well, @${user.split('@')[0]}, consider yourself thoroughly shaken and stirred! 🍸`,
        `💼 Suit up, @${user.split('@')[0]}! You've been promoted to the position of Group Exiter. Congrats on the new title! 👔`,
        `🕰️ Tick-tock, tick-tock. The time has come, @${user.split('@')[0]}! Your membership clock has run out. ⏰`,
        `🚂 All aboard the Kicked Express! Next stop: @${user.split('@')[0]}'s departure from the group platform. 🚄`,
        `🏰 The castle gates are closing, @${user.split('@')[0]}. It's a fairy tale ending – without you in the group story! 🏰`,
        `🪞 Mirror, mirror on the wall, who's getting kicked out of the group? Oh, it's @${user.split('@')[0]} after all! 🪞`,
        `🌪️ Hold on tight, @${user.split('@')[0]}! You're about to experience the whirlwind of being kicked! 💨`,
        `🎉 And the award for the fastest exit goes to @${user.split('@')[0]}! Zoom, gone! 🚀`,
        `💨 @${user.split('@')[0]} decided to catch the breeze and gracefully leave the scene. Adieu! 🌬️`,
        `🎭 Performing the disappearing act with @${user.split('@')[0]}. Abracadabra, and they're out! 🎩`,
        `🏹 Bullseye! Direct hit on @${user.split('@')[0]} as they get kicked to the curb. Bye-bye! 🎯`,
        `🌊 Surfs up, @${user.split('@')[0]}! Riding the wave out of the group. Cowabunga! 🏄‍♂️`,
        `🎤 Dropping the mic and dropping @${user.split('@')[0]} from the group. Drop the beat! 🎶`,
        `🛌 Time for @${user.split('@')[0]} to hit the sack... kicked out of the group! Sweet dreams! 🌙`,
        `🚄 High-speed rail to the land of kicked users for @${user.split('@')[0]}. All aboard! 🚆`,   
        `🚀 Kicked @${user.split('@')[0]} to cyberspace! ✨`,
        `🪂 Parachuted @${user.split('@')[0]} out. Adios! 🌄`,
        `💨 @${user.split('@')[0]} vanished. Zoom, gone! 🚀`,
        `🎭 Abracadabra! @${user.split('@')[0]} disappeared. 🎩`,
        `🌊 Surfed out: @${user.split('@')[0]}. Cowabunga! 🏄‍♂️`,
        `🎤 Mic drop, @${user.split('@')[0]} kicked out. 🎶`,
        `🪦 @${user.split('@')[0]} RIP in group. ☠️`,
        `🚀 Launched @${user.split('@')[0]}. Adios! 🎫`,
        `🎭 Magician's exit: @${user.split('@')[0]}. Vanished! 🧙`,
        `💨 @${user.split('@')[0]} zoomed out. Bye! 🚀`,
        `💥 Explosive kick: @${user.split('@')[0]}. Boom! 💣`,
        `🚄 Speedy exit for @${user.split('@')[0]}. All aboard! 🚆`,
        `🍁 @${user.split('@')[0]} is falling out like autumn leaves. Farewell to the seasonal departure! 🍂`,
        `🎶 The song of departure plays as @${user.split('@')[0]} exits the group stage. Encore? Nah, exit! 🎤`,
        `🚀 Ready, set, launch! @${user.split('@')[0]} rockets into the outer space of non-group existence. Gravity can't hold back the kicked! 🚀🌌`,   
        `💔 Farewell, @${user.split('@')[0]}! Remember, it's a group, not a circus.`,
        `👢 Kick time for @${user.split('@')[0]}! Common sense wasn't that common, huh?`,
        `🔔 Ring the bell of separation! @${user.split('@')[0]} tolls the kicked bell, echoing through the halls of group history. Ding dong! 🔔🚶‍♂️`,
	`🚪 Door's that way, @${user.split('@')[0]}! Rules were right here.`,
        `👋 @${user.split('@')[0]}, our group wasn't ready for your special brand of chaos.`,
        `⚖️ Justice served! @${user.split('@')[0]}, the courtroom of common sense has spoken.`,
        `📚 Class dismissed, @${user.split('@')[0]}! Maybe study the rules next time.`,
        `🚀 Rocketing @${user.split('@')[0]} out! A journey to learn group manners awaits.`,
        `🎬 Cue dramatic exit for @${user.split('@')[0]}! Spoiler: Rules apply.`,
        `🏳️‍🌈 Waving goodbye to @${user.split('@')[0]}! Colors of common sense not included.`,
        `🚮 Trash taken out! Sorry, @${user.split('@')[0]}, you were cluttering the chat.`,
        `🛑 Halt! @${user.split('@')[0]}, for the crime of not following rules, you're out.`,
        `🤯 Brain cells needed! @${user.split('@')[0]}, too much for our rule-abiding group.`,
        `🧹 Sweeping out the chat! @${user.split('@')[0]}, cleanliness is next to groupiness.`,
        `🚽 Flushed away! @${user.split('@')[0]}, along with the trouble you brought.`,
        `🏹 Bullseye on @${user.split('@')[0]}! Kicked for a direct hit on group harmony.`,
        `🚪 Exit stage left, @${user.split('@')[0]}! Your performance needed more adherence to rules.`,
        `💥 Explosion of @${user.split('@')[0]}! Bursting with creativity, lacking in rule-following.`,
        `🪓 Axed! @${user.split('@')[0]}, consider this a chop-chop reminder to mind the rules.`,
        `🚶‍♂️ Walk of shame for @${user.split('@')[0]}! Adieu to rule-breakers.`,
	`🌪️ Hold on tight, @${user.split('@')[0]}! You're about to experience the whirlwind of being kicked! 💨`,
        `🎈 Just popped the balloon of @${user.split('@')[0]}'s presence. Farewell! 🎈`,
        `🚁 @${user.split('@')[0]} has boarded the helicopter of removal. See you on the other side! 🚁`,
	`🔥 Ready, set, delete! @${user.split('@')[0]} has vanished into thin air. Poof! ✨`,
        `🚶‍♂️ Taking a walk down the kicked lane with @${user.split('@')[0]}. Keep up if you can! 🏃‍♂️`,
        `🪂 Parachuting @${user.split('@')[0]} out of the group. Enjoy the soft landing! 🌄`,
        `🎉 And the award for the fastest exit goes to @${user.split('@')[0]}! Zoom, gone! 🚀`,
        `💨 @${user.split('@')[0]} decided to catch the breeze and gracefully leave the scene. Adieu! 🌬️`,
        `🎭 Performing the disappearing act with @${user.split('@')[0]}. Abracadabra, and they're out! 🎩`,
        `🏹 Bullseye! Direct hit on @${user.split('@')[0]} as they get kicked to the curb. Bye-bye! 🎯`,
        `🌊 Surfs up, @${user.split('@')[0]}! Riding the wave out of the group. Cowabunga! 🏄‍♂️`,
        `🎤 Dropping the mic and dropping @${user.split('@')[0]} from the group. Drop the beat! 🎶`,
        `🕰️ Tick-tock, tick-tock. Time's up, @${user.split('@')[0]}! Kicked with precision. ⏰`,
        `🪣 @${user.split('@')[0]} has been scooped out of the group like a scoop of ice cream. Melt away! 🍦`,
        `🪦 Graveyard shift for @${user.split('@')[0]} as they get buried in the list of kicked users. RIP! ☠️`,
        `🚀 Launching @${user.split('@')[0]} to a solo adventure. It's a one-way ticket! 🎫`,
        `🚶‍♀️ Stepping out of the group with style, @${user.split('@')[0]}. Catwalk, and they're gone! 👠`,
        `🎈 Bursting the balloon of @${user.split('@')[0]}'s group presence. Pop! Bye-bye! 🎈`,
        `🎭 Mastering the art of disappearing, @${user.split('@')[0]}. Vanish on, magician! 🧙`,
        `🍃 @${user.split('@')[0]} decided to leaf the group. Autumn vibes, farewell! 🍁`,
        `💣 Explosive exit by @${user.split('@')[0]}. Boom! The group will never be the same! 💥`,
        `🏏 Cricket rules: @${user.split('@')[0]} is out for a duck! Clean bowled by the admin. 🏏`,
	`🛌 Time for @${user.split('@')[0]} to hit the sack... kicked out of the group! Sweet dreams! 🌙`,
        `🚄 High-speed rail to the land of kicked users for @${user.split('@')[0]}. All aboard! 🚆`,   
        `🚀 Kicked @${user.split('@')[0]} to cyberspace! ✨`,
        `🪂 Parachuted @${user.split('@')[0]} out. Adios! 🌄`,
        `💨 @${user.split('@')[0]} vanished. Zoom, gone! 🚀`,
        `🎭 Abracadabra! @${user.split('@')[0]} disappeared. 🎩`,
        `🌊 Surfed out: @${user.split('@')[0]}. Cowabunga! 🏄‍♂️`,
        `🎤 Mic drop, @${user.split('@')[0]} kicked out. 🎶`,
        `🪦 @${user.split('@')[0]} RIP in group. ☠️`,
        `🚀 Launching @${user.split('@')[0]} solo. 🎫`,
        `🎈 Balloon burst: @${user.split('@')[0]}. Bye! 🎈`,
        `🚶‍♀️ Catwalk exit: @${user.split('@')[0]}. Vanish! 👠`,
        `💣 Explosive exit by @${user.split('@')[0]}. Boom! 💥`,
        `🛌 Sleep tight, @${user.split('@')[0]}. Kicked outta here! 🌙`,
        `🚄 High-speed rail for @${user.split('@')[0]}. All aboard! 🚆`,
        `🚀 Poof! @${user.split('@')[0]} vanished. ✨`,
        `🪦 Graveyard shift: @${user.split('@')[0]} RIP. ☠️`,
        `🚀 Launched @${user.split('@')[0]}. Adios! 🎫`,
        `🎭 Magician's exit: @${user.split('@')[0]}. Vanished! 🧙`,
        `💨 @${user.split('@')[0]} zoomed out. Bye! 🚀`,
        `🔨 Initiating Operation: Goodbye @${user.split('@')[0]}! Stand by as we calibrate the ejector seat... 3... 2... 1... BOOM! And there they go, flying out of the group faster than a rocket with no parachute. Don’t look down—it’s a long way back! 🚀`,
        `🥊 Ding ding ding! Ladies and gentlemen, in the left corner, we have @${user.split('@')[0]}, desperately clinging to relevance. And in the right corner, me—admin supreme, wielding the almighty Kick Button. Round one: slap, slap, SLAP. And... KO! See ya, champ. 🥴`,
        `🎩 Step right up, @${user.split('@')[0]}, for the magical disappearing act of the century! Watch closely as I wave my admin wand and—POOF—you’re gone, just like that. No applause, no encore, just a puff of smoke and an empty space where you once stood. 🪄`,
        `🎮 Alright, @${user.split('@')[0]}, it’s game over. No continues, no cheat codes, and certainly no respawns. The admin has spoken, and you’ve been uninstalled from this group. Don’t let the loading screen hit you on the way out! 🎲`,
        `🪑 Please have a seat, @${user.split('@')[0]}—oh wait, you’re already standing on your way out the door. Let me hold it open for you. There you go! Smooth exit, wasn’t it? Bye-bye now, and don’t come back without a visitor’s pass. 🛑`,
        `🛠️ Time for a quick system upgrade. Step one: locate @${user.split('@')[0]}. Step two: press “remove” with extreme prejudice. Step three: enjoy the newfound peace and quiet. Update complete—group harmony restored. You’re welcome! 🤖`,
        `🏏 Picture this, @${user.split('@')[0]}: you’re standing at the crease, bat in hand, thinking you’re ready. Then BAM! Out for a duck, clean bowled by the admin’s precision. Time to hit the showers. Better luck next match, sport! 🏟️`,
        `🌊 Alright, everyone, watch as I send @${user.split('@')[0]} off on a one-way trip down the River of No Return. Life jackets not included, paddles optional, and the final destination? Anywhere but here. Bon voyage! 🚣‍♂️`,
        `🍔 This group is a perfectly stacked burger, and you, @${user.split('@')[0]}, are the soggy lettuce no one wants. Time to pluck you out and restore the flavor. Crunch crunch—off you go! 🌭`,
        `🎭 Ladies and gentlemen, the curtain rises on @${user.split('@')[0]}’s final scene. A swift boot, an exaggerated exit, and... silence. The crowd goes wild! Bravo to the admin for this Oscar-worthy performance. 🎬`,
        `⚔️ Unsheathing the admin sword, sharpening it to a gleaming edge, and SWISH! One clean strike sends @${user.split('@')[0]} off to the land of forgotten group members. Rest in pieces. 🩸`,
        `🎿 Alright, @${user.split('@')[0]}, your slope ends here. The admin has just pushed you off the edge, and there’s no ski lift back. Have fun tumbling down that hill of irrelevance. 🏔️`,
        `🍂 This group is a cozy autumn forest, and you, @${user.split('@')[0]}, are the one brown leaf stuck on my windshield. *Flick!* There. Much better. Enjoy the breeze on your way out! 🍁`,
        `🦵 Crack knuckles. Stretch. Big deep breath. And... WHAM! That’s the sound of me kicking @${user.split('@')[0]} so far out of this group, they landed in another timezone. Good luck finding your way back! 🥾`,
        `🐲 Alright, let’s make this dramatic. I summon the mythical admin dragon. It swoops in, breathes fire, and with one mighty roar—there goes @${user.split('@')[0]}, incinerated and banished forever. 🔥`,
        `🍎 Hey @${user.split('@')[0]}, you’re like that one worm in the apple. Time to chuck you into the compost heap and let the group stay fresh. Enjoy your new environment! 🌳`,
        `💼 Professional admin services at your disposal. Step one: identify @${user.split('@')[0]}. Step two: package them up. Step three: ship them off to irrelevance. Tracking ID not provided. 📦`,
        `🎷 Ahem. Do re mi fa sol... SLAP! That’s the sound of me playing @${user.split('@')[0]} off the stage. No encore, no standing ovation—just the sweet sound of silence. 🎺`,
        `🪞 Mirror, mirror, on the wall, who’s the admin who’ll end it all? It’s me. Time to clean up this fairy tale, and @${user.split('@')[0]}? You’re the villain we’re cutting from the script. Happily ever after begins now. 🏰`,
        `🚿 Turn on the water, grab the mop, and scrub scrub scrub. Oh look, @${user.split('@')[0]} has been washed down the drain! The group is squeaky clean again. Good riddance, grime! 🧽`,
        `🕹️ Alright, who gave @${user.split('@')[0]} the controller? No worries—admin override activated. And DELETE. Player 2 has been disqualified. No rematch, sorry! 🎮`,
        `🎢 Let me narrate: @${user.split('@')[0]} is currently on the admin rollercoaster. Here comes the steep drop... AHHHHH—and now they’ve hit the ejector loop. Enjoy the free fall, pal! 🎠`,
        `🪶 Pluck pluck pluck. There goes @${user.split('@')[0]}, like a stray feather from a majestic eagle. No longer part of the flight, just drifting away on the wind. Bye, birdie! 🦅`,
	`💥 Explosive kick: @${user.split('@')[0]}. Boom! 💣`,
        `🚄 Speedy exit for @${user.split('@')[0]}. All aboard!`,
    ];

    // Send a random fun message before removing the user
    m.reply(getRandomMessage(funnyMessages), m.chat, { mentions: [user] });
    m.react('✈️');


    // Add a slight delay before attempting to remove the user
    await sleep(500);
       
    // Remove the user
    await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
};

handler.help = ['kick @user'];
handler.tags = ['group'];
handler.command = ['kick', 'expell', 'remove'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;

// Function to get a random message from the array
function getRandomMessage(messages) {
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
}

// Function to sleep for a specified duration
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}		
