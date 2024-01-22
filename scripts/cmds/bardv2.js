const axios = require('axios');
const tracker = {};

module.exports = {
  config: {
    name: "bardv2",
    version: 2.0,
    author: "rehat--",
    longDescription: { en: "Trained By Google Most Accurate LLM Model"},
    category: "ai",
    guide: {
      en: "{pn} <query>",
    },
    clearHistory: function () {
      global.GoatBot.onReply = new Map();
    },
  },
  onStart: async function ({ args, message, event, Reply, api }) {
    try {
      if (event.type === "message_reply" && event.messageReply.attachments && event.messageReply.attachments[0].type === "photo") {
        const photo = encodeURIComponent(event.messageReply.attachments[0].url);
        const query = args.join(" ");
        const url = `https://turtle-apis.onrender.com/api/gemini/img?prompt=${encodeURIComponent(query)}&url=${photo}`;
        const response = await axios.get(url);
        message.reply(response.data.answer);
        return;
      }

      const prompt = args.join(' ');
      const chat = event.senderID;

      if (prompt.toLowerCase() === "clear") { 
    this.config.clearHistory(); 
        delete tracker[chat]
      message.reply('Conversation history cleared.');
        return;
      }

      if (!tracker[chat]) {
        tracker[chat] = prompt;
      } else {
        tracker[chat] += '\n' + prompt;
      }
      const query = encodeURIComponent(tracker[chat]);
      if (!query) {
        return message.reply("Please enter a query.");
      }
      const response = await axios.get(`https://turtle-apis.onrender.com/api/gemini?query=${query}`);
      const answer = response.data.answer;

      message.reply({
        body: `${answer}.`,
      }, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          messageID: info.messageID,
          author: event.senderID
        });
      });
    } catch (error) {
      console.error(error.message);
      message.reply('An error occurred.');
    }
  },
  onReply: async function ({ args, message, event, Reply, api }) {
    try {
      const prompt = args.join(' ');
      const chat = event.senderID;

      if (!tracker[chat]) {
        tracker[chat] = prompt;
      } else {
        tracker[chat] += '\n' + prompt;
      }
      const query = encodeURIComponent(tracker[chat]);
      const response = await axios.get(`https://turtle-apis.onrender.com/api/gemini?query=${query}`);
      const answer = response.data.answer;
      message.reply({
        body: `${answer}`,
      }, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          messageID: info.messageID,
          author: event.senderID
        });
      });
    } catch (error) {
      console.error("An error occurred.");
      message.reply('An error occurred.');
    }
  }
}