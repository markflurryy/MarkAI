const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "corn",
    aliases: [],
    author: "kshitiz",
    version: "2.0",
    cooldowns: 5,
    role: 2,
    shortDescription: {
      en: ""
    },
    longDescription: {
      en: ""
    },
    category: "𝟭𝟴+",
    guide: {
      en: "{p}corn segs"
    }
  },
  onStart: async function ({ api, event, args }) {
 
    if (args.length === 0) {
      api.sendMessage({ body: 'Please provide a keyword.\nEx: {p}corn young' }, event.threadID, event.messageID);
      return;
    }

    const keyword = args.join(' ');

   
    api.sendMessage({ body: 'Loading video, please wait...' }, event.threadID, event.messageID);


    try {
      const response = await axios.get(`https://main.n4y4n-server.repl.co/nayan/pornhub?name=${keyword}`);
      const videoUrl = response.data.lowest; 

      
      const cachePath = path.join(__dirname, 'cache', 'video.mp4');
      const videoStream = fs.createWriteStream(cachePath);
      const videoResponse = await axios.get(videoUrl, { responseType: 'stream' });
      videoResponse.data.pipe(videoStream);

      videoStream.on('finish', () => {
        
        api.sendMessage({ attachment: fs.createReadStream(cachePath) }, event.threadID, () => {
      
          fs.unlinkSync(cachePath);
        });
      });
    } catch (error) {
      console.error('Error sending video:', error.message);
      
      api.sendMessage({ body: 'Error sending video. Please try again later.' }, event.threadID, event.messageID);
    }
  }
};