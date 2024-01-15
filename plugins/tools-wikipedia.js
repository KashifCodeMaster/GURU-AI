import fetch from 'node-fetch';

const handler = async (m, { text, usedPrefix }) => {
  try {
    if (!text) {
      m.react('🤔');
      throw "Hey there! 🕵️‍♂️ You forgot to give me something to search. Try something like '" + usedPrefix + "wiki Artificial Intelligence'.";
    }

    m.react('⏳'); 

    const searchQuery = encodeURIComponent(text.toLowerCase()); // Make the search case-insensitive
    const variations = [
      encodeURIComponent(text), // Original query
      encodeURIComponent(text.replace(/\s+/g, '')), // Remove spaces
      encodeURIComponent(text.replace(/\s+/g, '').toLowerCase()), // Remove spaces and make lowercase
    ];

    let result = null;

    for (const variation of variations) {
      const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&utf8=1&srsearch=${variation}`;

      const response = await fetch(apiUrl);
      const apiResult = await response.json();

      if (apiResult.query && apiResult.query.search && apiResult.query.search.length > 0) {
        result = apiResult.query.search[0];
        break; // Stop searching when a result is found
      }
    }

    if (!result) {
      m.react('👀'); 
      throw 'Oops! No Wikipedia entry found for that query. Maybe try searching for something more mysterious? 🧐';
    }

    const { title, snippet } = result;
    const articleUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`;
    const imageUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&titles=${encodeURIComponent(title)}&pithumbsize=300`;

    const imageResponse = await fetch(imageUrl);
    const imageResult = await imageResponse.json();
    const imageUrlResult = imageResult.query.pages[Object.keys(imageResult.query.pages)[0]].thumbnail?.source;

    const timestamp = new Date().toLocaleString();

    let message = `📚 *Wikipedia Search Result:*\n\n*Title:* ${title}\n\n*Snippet:* ${snippet}\n\nRead more: ${articleUrl}\n\n🕒 *Timestamp:* ${timestamp}`;

    if (imageUrlResult) {
      message = {
        url: imageUrlResult,
        caption: message,
      };
    }

    m.react('🔍'); 
    m.reply(message);
  } catch (error) {
    console.error(`Wikipedia search error: ${error}`);
    m.react('🥺'); 
    m.reply("Uh-oh! 🙈 Something went sideways while searching on Wikipedia. Mind trying again later?");
  }
};

handler.help = ['wiki'];
handler.tags = ['search'];
handler.command = /^(wiki|wikipedia)$/i;

export default handler;
		
