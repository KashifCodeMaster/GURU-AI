import TicTacToe from '../lib/tictactoe.js'

let handler = async (m, { conn, usedPrefix, command, text }) => {
    conn.game = conn.game || {}
    
    // Check if the user is already in a game
    if (Object.values(conn.game).find(room => room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender))) {
        throw `🙃 *Hold up!* You're already in a game. Finish that first or type *${usedPrefix}delttt* to rage-quit gracefully.`
    }

    // Validate input
    if (!text) {
        throw `🤔 *Confused?* You need to provide a room name or number. Try: *${usedPrefix}${command} [room name]*`
    }

    // Find a waiting room
    let room = Object.values(conn.game).find(room => room.state === 'WAITING' && (text ? room.name === text : true))
    
    if (room) {
        // Join an existing room
        m.reply(`🎉 *Ding ding ding!* You've got a match.`)
        room.o = m.chat
        room.game.playerO = m.sender
        room.state = 'PLAYING'

        let arr = room.game.render().map(v => ({
            X: '❎',
            O: '⭕',
            1: '1️⃣',
            2: '2️⃣',
            3: '3️⃣',
            4: '4️⃣',
            5: '5️⃣',
            6: '6️⃣',
            7: '7️⃣',
            8: '8️⃣',
            9: '9️⃣',
        }[v]))

        let str = `
🤝 *Match Ready!* Waiting for @${room.game.currentTurn.split('@')[0]} to make their move.

${arr.slice(0, 3).join('')}
${arr.slice(3, 6).join('')}
${arr.slice(6).join('')}

📌 *Room ID:* ${room.id}

📜 *How to Play:*
‣ Make 3 rows of the same symbol (vertical, horizontal, or diagonal) to win.
‣ Type *surrender* if you're too chicken to continue.

🔔 *Your Turn!*
`.trim()

        // Notify both players
        if (room.x !== room.o) {
            await conn.reply(room.x, str, m, { mentions: conn.parseMention(str) })
        }
        await conn.reply(room.o, str, m, { mentions: conn.parseMention(str) })
    } else {
        // Create a new room
        room = {
            id: 'tictactoe-' + (+new Date),
            x: m.chat,
            o: '',
            game: new TicTacToe(m.sender, 'o'),
            state: 'WAITING'
        }
        if (text) room.name = text

        conn.reply(m.chat, `🕒 *Room Created!*\nYou're waiting for a second player to join. 
        
To join, someone needs to type:
📢 *${usedPrefix}${command} ${text}*

🙄 Feeling lonely? Invite a friend to this epic showdown.

🎁 *Rewards:* 4999 XP (and eternal bragging rights).`, m, {
            mentions: conn.parseMention(text)
        })
        
        conn.game[room.id] = room
    }
}

handler.help = ['tictactoe <room name>']
handler.tags = ['game']
handler.command = ['tictactoe', 'ttc', 'ttt', 'xo']

export default handler
