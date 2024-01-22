const os = require('os');
const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

function byte2mb(bytes) {
  let l = 0,
    n = parseInt(bytes, 10) || 0;
  while (n >= 1024 && ++l) n = n / 1024;
  return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
}

module.exports = {
  config: {
    name: 'stats',
    version: '1.0.0',
    author: 'Lance Ajiro',
    countDown: 5,
    role: 0,
    shortDescription: {
      en: 'Displays bot uptime, number of users and groups.'
    },
    longDescription: {
      en: 'This command displays bot uptime, the number of users and groups it is in, and RAM usage.'
    },
    category: 'system',
    guide: {
      en: 'No additional information available.'
    }
  },
  onStart: async function ({ message, event }) {
    const startTime = Date.now();
    const uptimeInSeconds = process.uptime();
    const uptimeFormatted = new Date(uptimeInSeconds * 1000).toISOString().substr(11, 8);
    const totalUsers = global.db.allUserData.length;
    const totalGroups = global.db.allThreadData.length;
    const ping = Date.now() - startTime;
    const memoryUsage = process.memoryUsage();

    const messageText = `
     ⦿ Operating Time: ${uptimeFormatted}
     ⦿ Total Users: ${totalUsers}
     ⦿ Total Groups: ${totalGroups}
     ⦿ RAM usage: ${byte2mb(memoryUsage.rss)}
    `.replace(/\n\s+/g, '\n');

    message.reply(messageText);
  }
};
