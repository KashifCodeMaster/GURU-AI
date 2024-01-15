import fetch from 'node-fetch';

function getRandomCaption(mediaType) {
  const captions = {
    image: [
      '🖼️ Here is your requested image!',
      '✨ Image delivered, enjoy!',
      '⚡ Just fetched this visual delight!',
    ],
    video: [
      '🎥 Enjoy your requested video!',
      '🌟 Video vibes activated!',
      '🍿 Grab some popcorn and enjoy!',
    ],
  };

  const typeCaptions = captions[mediaType] || [];

  if (typeCaptions.length === 0) {
    return '🤖 Just another media file!';
  }

  return typeCaptions[Math.floor(Math.random() * typeCaptions.length)];
}

function getRandomProcessingMessage() {
  const messages = [
    '_🔄 Fetching wonders..._',
    '_⚙️ Processing magic..._',
    '_🌐 Transferring pixels..._',
    '_📥 Downloading..._',
    '_📇 Printing...',
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}

let handler = async (m, { conn, text }) => {
  try {
    if (!text) {
      m.react('🤦🏻‍♀️');
      throw 'Oops! You forgot to provide the URL of an Instagram video, post, reel, or image. Silly you!';
    }

    m.react('⏳'); 

    const response = await fetch(`${gurubot}/igdlv1?url=${text}`);
    const apiResponse = await response.json();

    if (!apiResponse || !apiResponse.data || apiResponse.data.length === 0) {
      m.react('🥺'); 
      throw 'Oh no! It seems there is no video or image found. Double-check the URL or try another one.';
    }

    m.react('📥'); 
    m.reply(getRandomProcessingMessage()); 

    for (const mediaData of apiResponse.data) {
      const mediaType = mediaData.type;
      const mediaURL = mediaData.url_download;
      const fileName = `instagram.${mediaType === 'video' ? 'mp4' : 'jpg'}`;

      const randomCaption = getRandomCaption(mediaType);

      let caption = `${getRandomProcessingMessage()}\n\n${randomCaption}\n\nEnjoy the ${mediaType.toUpperCase()}!`;

      await conn.sendFile(m.chat, mediaURL, fileName, caption, m);
      m.react('✅'); 
    }
  } catch (error) {
    m.react('🥺'); 
    throw `Whoopsie! An error occurred: ${error.message}. Fear not, we'll fix it in a jiffy!`;
  }
};

handler.help = ['instagram'];
handler.tags = ['downloader'];
handler.command = /^(instagram|igdl|ig|insta)$/i;

export default handler;
