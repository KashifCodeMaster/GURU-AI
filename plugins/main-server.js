import cp from 'child_process'
import { promisify } from 'util'
let exec = promisify(cp.exec).bind(cp)

let handler = async (m) => {
    await conn.reply(m.chat, "Hold on a second, I'm checking the server status... 🖥️", m)
    
    let output
    try {
        // Running the df command to check disk space
        output = await exec('df -h')
    } catch (e) {
        output = `🚨 Uh-oh! Something went wrong while checking the server. Error: ${e.message}`
    } finally {
        let { stdout, stderr } = output
        
        // If there's any stdout output, reply with the server disk usage info
        if (stdout.trim()) {
            m.reply(`💾 Here's the current server disk status:\n${stdout}`)
        }
        
        // If there's any stderr output (error), reply with it
        if (stderr.trim()) {
            m.reply(`⚠️ Warning! Something went wrong:\n${stderr}`)
        }

        // Additional handling for when no output is received (if that's possible)
        if (!stdout.trim() && !stderr.trim()) {
            m.reply("🧐 Hmm... The server didn’t respond as expected. I’ll have to investigate further!")
        }
    }
}

handler.help = ['server']
handler.tags = ['main']
handler.command = /^(server)$/i

export default handler
