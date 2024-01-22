const axios = require("axios");
const tinyurl = require("tinyurl");

module.exports = {
  config: {
    name: "gemini",
    version: "1.0",
    author: "Samir OE",
    countDown: 5,
    role: 0,
    category: "google",
  },
  onStart: async function ({ message, event, args, commandName }) {
    try {
      let shortLink;

      if (event.type === "message_reply") {
        if (["photo", "sticker"].includes(event.messageReply.attachments?.[0]?.type)) {
          shortLink = await tinyurl.shorten(event.messageReply.attachments[0].url);
        }
      } else {
        const text = args.join(' ');
        const response0 = await axios.get(`https://api.samirzyx.repl.co/api/Gemini?text=${encodeURIComponent(text)}`);

        if (response0.data && response0.data.candidates && response0.data.candidates.length > 0) {
          const textContent = response0.data.candidates[0].content.parts[0].text;
          const ans = `${textContent}`;
          message.reply({
            body: ans,
          }, (err, info) => {
            global.GoatBot.onReply.set(info.messageID, {
              commandName,
              messageID: info.messageID,
              author: event.senderID,
            });
          });
          return; 
        }
      }

      if (!shortLink) {
        console.error("Error: Invalid message or attachment type");
        return;
      }

      const like = `https://tg.samirzyx.repl.co/telegraph?url=${encodeURIComponent(shortLink)}&senderId=784`;
      const response4 = await axios.get(like);
      const link = response4.data.result.link;

      const text = args.join(' ');
      const vision = `https://api.samirzyx.repl.co/api/gemini-pro?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`;

      const response1 = await axios.get(vision);
      message.reply({
        body: response1.data,
      });
    } catch (error) {
      console.error("Error:", error.message);
    }
  },

  onReply: async function ({ message, event, Reply, args }) {
    try {
      let { author, commandName } = Reply;
      if (event.senderID !== author) return;

      const gif = args.join(' ');
      const response23 = await axios.get(`https://api.samirzyx.repl.co/api/Gemini?text=${encodeURIComponent(gif)}`);

      if (response23.data && response23.data.candidates && response23.data.candidates.length > 0) {
        const textContent = response23.data.candidates[0].content.parts[0].text;
        const wh = `${textContent}`;
        message.reply({
          body: wh,
        }, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName,
            messageID: info.messageID,
            author: event.senderID,
          });
        });
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  },
};