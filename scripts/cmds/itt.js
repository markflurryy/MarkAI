const Tesseract = require('tesseract.js');

module.exports = {
  config: {
    name: 'itt',
    version: '1.0',
    author: 'Mark',
    shortDescription: {
      en: 'Extract text from an image.'
    },
    category: 'utility',
  },

  onStart: async function ({ event, api, message }) {
    try {
      // Check if the user replied to an image
      if (event.type !== 'message_reply' || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
        return message.reply('Please reply to an image to extract text.');
      }

      // Get the image URL from the replied message
      const imageUrl = event.messageReply.attachments[0].url;

      // Use Tesseract.js to extract text from the image
      const result = await Tesseract.recognize(imageUrl);

      if (result && result.data && result.data.text) {
        return message.reply(`Extracted text from the image:\n\n${result.data.text}`);
      } else {
        return message.reply('No text could be extracted from the image.');
      }
    } catch (error) {
      console.error('Error while processing image:', error);
      return api.sendMessage('An error occurred while processing the image.', event.threadID, event.messageID);
    }
  }
};
