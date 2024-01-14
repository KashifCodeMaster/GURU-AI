import fetch from 'node-fetch';

const BASE_URL = 'https://bible-api.com';

let bibleChapterHandler = async (m, { conn, usedPrefix }) => {
  try {
    // Extract the chapter number or name from the command text.
    let chapterInput = m.text.split(' ').slice(1).join('').trim();

    if (!chapterInput) {
      throw new Error(`Please specify the chapter number or name. Example: ${usedPrefix}bible john 3:16`);
    }

    // Encode the chapterInput to handle special characters
    chapterInput = encodeURIComponent(chapterInput);

    // Make an API request to fetch the chapter information.
    let chapterRes = await fetch(`${BASE_URL}/${chapterInput}`);
    
    if (!chapterRes.ok) {
      throw new Error(`Unable to retrieve information for the specified chapter. Please check your input. Example: ${usedPrefix}bible john 3:16`);
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
    console.error(error);
    m.reply(`Error: ${error.message}`);
  }
};

bibleChapterHandler.help = ['bible [chapter_number|chapter_name]'];
bibleChapterHandler.tags = ['religion'];
bibleChapterHandler.command = ['bible', 'chapter'];

export default bibleChapterHandler;
