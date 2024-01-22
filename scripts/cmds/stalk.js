const fs = require('fs');
const request = require('request');
const cache = `${__dirname}/tmp/`;

module.exports = {
  config: {
    name: "stalk",
    version: "1.0.0",
    author: "Lance Ajiro",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Stalk a user and get their information."
    },
    longDescription: {
      en: "Stalk a user and get their information. Mention a user or use the command to stalk yourself."
    },
    category: "User",
    guide: {
      en: "Mention a user or use the command to stalk yourself."
    }
  },
  onStart: async function ({ api, event, args, message }) {
    try {
      var uid = Object.keys(event.mentions)[0];
      if (Object.keys(event.mentions).length === 0) {
        uid = event.senderID; // Use the sender's ID if no mentions
      }

      let data = await api.getUserInfo(parseInt(uid));
      var picture = `https://graph.facebook.com/${uid}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      var file = fs.createWriteStream(`${cache}stalk.png`);
      var rqs = request(encodeURI(`${picture}`));
      rqs.pipe(file);

      file.on('finish', function () {
        var name = data[uid].name;
        var username = data[uid].vanity;
        var herGender = data[uid].gender;
        var type = data[uid].type;
        var url = data[uid].profileUrl;
        var firstName = data[uid].firstName;
        let gender = "";
        switch (herGender) {
          case 1:
            gender = "Female";
            break;
          case 2:
            gender = "Male";
            break;
          default:
            gender = "Custom";
        }

        message.reply({
          body: `Information about ${firstName}\n\nName: ${name}\nUsername: ${username}\nGender: ${gender}\nType: ${type}\nProfile URL: ${url}\nUID: ${uid}`,
          attachment: fs.createReadStream(`${cache}stalk.png`)
        });
      });
    } catch (err) {
      console.error('Error:', err);
      message.reply('An error occurred while stalking. Please try again later.');
    }
  }
};
