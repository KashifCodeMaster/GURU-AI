import fetch from "node-fetch";
import play from "play-dl"; // Alternative to youtubedl-core
import yts from 'youtube-yts';
import fs from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import os from 'os';

const streamPipeline = promisify(pipeline);
const cooldownTime = 3 * 60 * 1000;  // 3 minutes cooldown
let lastPlayTime = 0; // Global cooldown

const handler = async (m, { conn, command, text, args, usedPrefix }) => {
    const sender = m.sender;

    // Global cooldown check
    if (lastPlayTime && Date.now() - lastPlayTime < cooldownTime) {
        const waitTime = Math.ceil((cooldownTime - (Date.now() - lastPlayTime)) / 1000);
        await conn.reply(m.chat, `⏳ Whoa! Please wait *${waitTime} seconds* before requesting another song. Meanwhile, enjoy the tunes 🎶`, m);
        return;
    }

    if (!text) throw `Please type a song to search, e.g., *${usedPrefix + command}* Imagine Dragons`;

    conn.MUSICPLAYER = conn.MUSICPLAYER || {};
    await m.react('🔍');
    let searchMsg = await conn.sendMessage(m.chat, { text: "🎵 Searching for the perfect vibes... Hold tight!" }, { quoted: m });

    const updateSearchMessage = async (newText) => {
        await conn.relayMessage(m.chat, {
            protocolMessage: {
                key: searchMsg.key,
                type: 14,
                editedMessage: { conversation: newText }
            }
        }, {});
    };

    setTimeout(() => updateSearchMessage("🔎 Still hunting down the best tracks for you..."), 3000);
    setTimeout(() => updateSearchMessage("🎧 Almost there! Just a moment more..."), 6000);

    const result = await searchAndDownloadMusic(text);

    if (!result || result.allLinks.length === 0) {
        await conn.sendMessage(m.chat, { text: "😔 Oops, couldn't find any tracks matching that search. Try again!" }, { quoted: m });
        return;
    }

    const infoText = `✨ Welcome to *Music Player* ✨\n\nSelect a song number from the list to play it 🎸\n\n`;
    const orderedLinks = result.allLinks.map((link, index) => `*${index + 1}.* ${link.title}`).join("\n\n");
    const fullText = `${infoText}\n${orderedLinks}`;

    setTimeout(() => updateSearchMessage(fullText), 9000);

    const timeoutId = setTimeout(() => {
        delete conn.MUSICPLAYER[sender];
        conn.relayMessage(m.chat, {
            protocolMessage: {
                key: searchMsg.key,
                type: 14,
                editedMessage: { conversation: "🕰️ Options timed out! Request again if you need more tunes 🎶" }
            }
        }, {});
    }, 45000);

    conn.MUSICPLAYER[sender] = {
        result,
        key: searchMsg.key,
        timeoutId
    };

    lastPlayTime = Date.now();
};

handler.before = async (m, { conn }) => {
    conn.MUSICPLAYER = conn.MUSICPLAYER || {};
    const sender = m.sender;

    if (!(sender in conn.MUSICPLAYER)) return;

    const { result, key, timeoutId } = conn.MUSICPLAYER[sender];
    if (!m.quoted || m.quoted.id !== key.id || !m.text) return;

    const choice = parseInt(m.text.trim());
    if (!choice || choice < 1 || choice > result.allLinks.length) {
        m.reply("🚫 Invalid choice! Please pick a number from the list.");
        return;
    }

    clearTimeout(timeoutId);
    await m.react('⏳');
    await conn.relayMessage(m.chat, {
        protocolMessage: {
            key: key,
            type: 14,
            editedMessage: { conversation: "📥 Downloading your track... Please hold on!" }
        }
    }, {});

    const selectedUrl = result.allLinks[choice - 1].url;
    const thumbnailUrl = result.allLinks[choice - 1].thumbnail;
    const title = generateRandomName();
    const tmpDir = os.tmpdir();
    const filePath = `${tmpDir}/${title}.mp3`;

    const audioStream = await play.stream(selectedUrl);
    const writableStream = fs.createWriteStream(filePath);

    const downloadProgressUpdates = async () => {
        setTimeout(() => updateDownloadProgress("🎶 25% complete… setting the vibes 🎶"), 2000);
        setTimeout(() => updateDownloadProgress("⏳ 50% done… getting closer!"), 4000);
        setTimeout(() => updateDownloadProgress("🚀 75% … just about ready!"), 6000);
        setTimeout(() => updateDownloadProgress("📥 Download complete! Preparing to send…"), 8000);
    };

    const updateDownloadProgress = async (newText) => {
        await conn.relayMessage(m.chat, {
            protocolMessage: {
                key: key,
                type: 14,
                editedMessage: { conversation: newText }
            }
        }, {});
    };

    downloadProgressUpdates();
    await streamPipeline(audioStream.stream, writableStream);

    const doc = {
        audio: { url: filePath },
        mimetype: 'audio/mpeg',
        fileName: `${title}`,
        jpegThumbnail: await fetchThumbnail(thumbnailUrl)
    };

    await conn.sendMessage(m.chat, doc, { quoted: m });
    await conn.relayMessage(m.chat, {
        protocolMessage: {
            key: key,
            type: 14,
            editedMessage: {
                conversation: `🎼 Now playing: *${result.allLinks[choice - 1].title}* - Enjoy the vibes! 🎶`
            }
        }
    }, {});

    delete conn.MUSICPLAYER[sender];
};

handler.help = ["play"];
handler.tags = ["downloader"];
handler.command = /^(play)$/i;
handler.limit = true;
export default handler;

function generateRandomName() {
    const adjectives = ["happy", "sad", "funny", "brave", "clever", "kind", "silly", "wise", "gentle", "bold"];
    const nouns = ["cat", "dog", "bird", "tree", "river", "mountain", "sun", "moon", "star", "cloud"];
    return adjectives[Math.floor(Math.random() * adjectives.length)] + "-" + nouns[Math.floor(Math.random() * nouns.length)];
}

async function searchAndDownloadMusic(query) {
    try {
        const { videos } = await yts(query);
        if (!videos.length) return null;

        const allLinks = videos.map(video => ({
            title: video.title,
            url: video.url,
            thumbnail: video.thumbnail
        }));

        return {
            title: videos[0].title,
            allLinks: allLinks,
        };
    } catch (error) {
        return null;
    }
}

async function fetchThumbnail(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) return null;
        const buffer = await response.buffer();
        return buffer;
    } catch {
        return null;
    }
}
