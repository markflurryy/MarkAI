const axios = require("axios");
const fs = require("fs");

module.exports = {
  config: {
   name: "bard",
   aliases: ["tite"],
   version: "1.0.0",
   author: "Grey Convert to goatbot Eugene Codm",
   countDown: 0,
   role: 0,
   shortDescription: {
    en: "ask"
   },
   longDescription: {
    en: "Ask"
   },
   category: "subject",
   guide: {
    en: "[bard ask]"
   }
  },

onChat: async function({ api, event }) {
  if (!(event.body.indexOf("bard") === 0 || event.body.indexOf("Bard") === 0))
 return;

  const args = event.body.split(/\s+/);
  args.shift();

  let { threadID, messageID } = event;
  const cookies = "dwhul_cYgEUwwxCdJQKaZWYP7sMafoaQdwYNf5gAm2rsKy80Ulp3V97CqJqlu3ENJRvE6Q."; // place your cookie here
  const response = event.body.slice(5).trim();

  if (!response) {
    api.sendMessage("Please provide a question or query", threadID, messageID);
    return;
  }

  api.sendMessage("Searching for an answer, please wait...", threadID, messageID);

  try {
    const res = await axios.get(`https://gptgotest.lazygreyzz.repl.co/ask?cookies=${cookies}&question=${response}`);
    const responseData = JSON.parse(res.data.response);
    const message = responseData.response;
    const imageUrls = responseData.image;

    if (message && message.length > 0) {
      const photoUrls = imageUrls.map(url => url.replace(/\\(.)/mg, "$1")); 

      const photoAttachments = [];

      if (!fs.existsSync("tmp")) {
        fs.mkdirSync("tmp");
      }

      for (let i = 0; i < photoUrls.length; i++) {
        const url = photoUrls[i];
        const photoPath = `tmp/photo_${i + 1}.png`;

        try {
          const imageResponse = await axios.get(url, { responseType: "arraybuffer" });
          fs.writeFileSync(photoPath, imageResponse.data);

          photoAttachments.push(fs.createReadStream(photoPath));
        } catch (error) {
          console.error("Error occurred while downloading and saving the photo:", error);
        }
      }

      api.sendMessage(
        {
          attachment: photoAttachments,
          body: message,
        },
        threadID,
        messageID
      );
    } else {
      api.sendMessage(message, threadID, messageID);
    }
  } catch (error) {
    console.error("Error occurred while fetching data from the Bard API:", error);
    api.sendMessage("An error occurred while processing your request.", threadID, messageID);
  }
},
onStart: async function ({ api, event }) {
  api.sendMessage(`This command doesn't need a prefix`, event.threadID, event.messageID);

}
 }; 