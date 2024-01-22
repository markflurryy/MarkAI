module.exports = {
  config: {
    name: "poli",
    version: "1.0",
    author: "Kp Sharma Oli",
    shortDescription: {
      en: "Make images from yours prompts."
    },
    longDescription: {
      en: "Make images from yours prompts."
    },
    category: "ai",
    role: 2,
    guide: {
      en: "{pn} prompt",
      vi: "{pn}"
    }
  },

  onStart: async function ({ message, api,event,args, threadsData, usersData }) {
const axios = require('axios');
const fs = require('fs-extra');
 let { threadID, messageID } = event;
  let query = args.join(" ");
  if (!query) return api.sendMessage("Please enter prompts", threadID, messageID);
let path = __dirname + `/assets/poli.png`;
  const poli = (await axios.get(`https://image.pollinations.ai/prompt/${query}`, {
    responseType: "arraybuffer",
  })).data;
  fs.writeFileSync(path, Buffer.from(poli, "utf-8"));
  api.sendMessage({
    body: "Image will be deleted after 1 hour!",
    attachment: fs.createReadStream(path) }, threadID, () => fs.unlinkSync(path), messageID);
}
};