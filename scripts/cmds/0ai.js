const axios = require('axios'); 

const Prefixes = [
'ask',
'.chi',
'Ai',
'george',
'George',
'ai',
'.ask',
'/ask',
'!ask',
'@ask',
'#ask',
'$ask',
'%ask',
'Bot',
'bot',
'.ai',
'/ai',
'!ai',
'@ai',
'#ai',
'$ai',
'who',
'Who',
'*ai',
'What',
'what',
]; 

module.exports = {
config: {
name: 'ask',
aliases: ["bot", "gpt"],
version: '2.5',
author: 'Mark',
role: 0,
category: 'utility',
shortDescription: {
en: 'Asks an AI for an answer.',
},
longDescription: {
en: 'Asks an AI for an answer based on the user prompt.',
},
guide: {
en: '{pn} [prompt]',
},
},
onStart: async function () {},
onChat: async function ({ api, event, args, message }) {
try {
const prefix = Prefixes.find((p) => event.body && event.body.toLowerCase().startsWith(p)); 

// Check if the prefix is valid
if (!prefix) {
return; // Invalid prefix, ignore the command
} 

// Remove the prefix from the message body
const prompt = event.body.substring(prefix.length).trim(); 

// Check if prompt is empty
if (prompt === '') {
await message.reply(
"🤖 : yes?, What is your question?"
);
return;
} 

// Send a message indicating that the question is being answered
await message.reply("🤖 : Answering your question..."); 

const response = await axios.get(`https://chatgayfeyti.archashura.repl.co?gpt=${encodeURIComponent(prompt)}`); 

if (response.status !== 200 || !response.data) {
throw new Error('Invalid or missing response from API');
} 

const messageText = response.data.content.trim(); 

await message.reply(messageText); 

console.log('Sent answer as a reply to user');
} catch (error) {
console.error(`Failed to get answer: ${error.message}`);
api.sendMessage(
`${error.message}.\n\n 🤖 : You can try typing your question again or resending it, as there might be a bug from the server that's causing the problem. It might resolve the issue.`,
event.threadID
);
}
},
};
