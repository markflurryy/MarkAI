module.exports = {
  config: {
    name: "pastebin",
    version: "1.0",
    author: "Mark",
    countDown: 5,
    role: 2,
    shortDescription: {
      en: "Upload files to pastebin and sends link"
    },
    longDescription: {
      en: "This command allows you to upload files to pastebin and sends the link to the file."
    },
    category: "utility",
    guide: {
      en: "To use this command, type {pn} <filename>. The file must be located in the 'cmds' folder."
    }
  },
  onStart: async function ({ message, args }) {
    const PastebinAPI = require('pastebin-js');
    const fs = require('fs');
    const path = require('path');

    const pastebin = new PastebinAPI({
      api_dev_key: 'k2h1SAzign8FLs0BfZwHGO1kiuKBQbXT',
      api_user_key: 'k2h1SAzign8FLs0BfZwHGO1kiuKBQbXT',
    });

    const fileName = args[0];

    if (!fileName) {
      return message.reply('Please provide a file name.');
    }

    const filePathWithoutExtension = path.join(__dirname, '..', 'cmds', fileName);
    const filePathWithExtension = path.join(__dirname, '..', 'cmds', fileName + '.js');

    if (!fs.existsSync(filePathWithoutExtension) && !fs.existsSync(filePathWithExtension)) {
      return message.reply('File not found!');
    }

    const filePath = fs.existsSync(filePathWithoutExtension) ? filePathWithoutExtension : filePathWithExtension;

    fs.readFile(filePath, 'utf8', async (err, data) => {
      if (err) throw err;

      const paste = await pastebin
        .createPaste({
          text: data,
          title: fileName,
          format: null,
          privacy: 1,
        })
        .catch((error) => {
          console.error(error);
        });

      const rawPaste = paste.replace("pastebin.com", "pastebin.com/raw");

      message.reply(`${rawPaste}`);
    });
  }
};