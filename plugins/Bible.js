import fetch from 'node-fetch';

const BASE_URL = 'https://bible-api.com';

let bibleChapterHandler = async (m, { conn, usedPrefix }) => {
  try {
    m.react('📖');

    let chapterInput = m.text.split(' ').slice(1).join('').trim();

    if (!chapterInput) {
      return m.reply(`Hey there! 🤠 You forgot to specify the chapter number or name. Example: ${usedPrefix}bible john 3:16`);
    }

    chapterInput = encodeURIComponent(chapterInput);

    let chapterRes = await fetch(`${BASE_URL}/${chapterInput}`);
    
    if (!chapterRes.ok) {
      return m.reply(`Oopsie daisy! 🌼 I couldn't retrieve information for the specified chapter. Please check your input. Example: ${usedPrefix}bible john 3:16`);
    }

    let chapterData = await chapterRes.json();

    let bibleChapter = `
📖 *The Holy Bible*\n
📜 *Chapter ${chapterData.reference}*\n
Type: ${chapterData.translation_name}\n
Number of verses: ${chapterData.verses.length}\n
🔮 *Chapter Content:*\n
${chapterData.text}`;

    m.reply(bibleChapter);
  } catch (error) {
    console.error('Bible Plugin Error:', error);
    m.reply(`Whoops! 🙈 There was an error fetching the Bible chapter. Please try again later.`);
  }
};

bibleChapterHandler.help = ['bible [chapter_number|chapter_name]'];
bibleChapterHandler.tags = ['religion'];
bibleChapterHandler.command = ['bible', 'chapter'];

export default bibleChapterHandler;
