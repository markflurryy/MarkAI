const axios = require("axios");

function formatFont(text) {
  const fontMapping = {
    a: "𝚊", b: "𝚋", c: "𝚌", d: "𝚍", e: "𝚎", f: "𝚏", g: "𝚐", h: "𝚑", i: "𝚒", j: "𝚓", k: "𝚔", l: "𝚕", m: "𝚖",
    n: "𝚗", o: "𝚘", p: "𝚙", q: "𝚚", r: "𝚛", s: "𝚜", t: "𝚝", u: "𝚞", v: "𝚟", w: "𝚠", x: "𝚡", y: "𝚢", z: "𝚣",
    A: "𝙰", B: "𝙱", C: "𝙲", D: "𝙳", E: "𝙴", F: "𝙵", G: "𝙶", H: "𝙷", I: "𝙸", J: "𝙹", K: "𝙺", L: "𝙻", M: "𝙼",
    N: "𝙽", O: "𝙾", P: "𝙿", Q: "𝚀", R: "𝚁", S: "𝚂", T: "𝚃", U: "𝚄", V: "𝚅", W: "𝚆", X: "𝚇", Y: "𝚈", Z: "𝚉"
  };

  let formattedText = "";
  for (const char of text) {
    if (char in fontMapping) {
      formattedText += fontMapping[char];
    } else {
      formattedText += char;
    }
  }

  return formattedText;
}

async function convertVoiceToText(audioUrl, api, event) {
  if (!audioUrl) {
    api.sendMessage("🔴 Missing audio URL.", event.threadID, event.messageID);
    return;
  }

  try {
    api.sendMessage("🔊 | Converting audio to text...", event.threadID);

    const response = await axios.get(`https://hazeyy-apis-combine.kyrinwu.repl.co/api/try/voice2text?url=${encodeURIComponent(audioUrl)}`);
    const text = response.data.transcription;

    if (text) {
      const formattedText = formatFont(text);
      api.sendMessage(`🎓 Meta AI Converted Text\n\n ${formattedText}`, event.threadID, event.messageID);
    } else {
      api.sendMessage("🔴 Unable to convert audio.", event.threadID, event.messageID);
    }
  } catch (error) {
    console.error("🔴 An error occurred while converting audio:", error);
    api.sendMessage("🔴 An error occurred while converting audio.", event.threadID, event.messageID);
  }
}

async function convertImageToCaption(imageURL, api, event) {
  if (!imageURL) {
    api.sendMessage("🔴 Missing image URL.", event.threadID, event.messageID);
    return;
  }

  try {
    api.sendMessage("📷 | Converting image to caption...", event.threadID);

    const response = await axios.get(`https://hazeyy-apis-combine.kyrinwu.repl.co/api/image2text/new?image=${encodeURIComponent(imageURL)}`);
    const caption = response.data.caption.generated_text;

    if (caption) {
      const formattedCaption = formatFont(caption);
      api.sendMessage(`📷 Meta AI Image Recognition\n\n ${formattedCaption}`, event.threadID, event.messageID);
    } else {
      api.sendMessage("🔴 Failed to convert the image.", event.threadID, event.messageID);
    }
  } catch (error) {
    console.error("🔴 Error in image recognition:", error);
    api.sendMessage("🔴 Error in image recognition", event.threadID, event.messageID);
  }
}

module.exports = {
  config: {
    name: "meta",
    aliases: [],
    author: "Hazeyy/kira",
    version: "69",
    cooldowns: 5,
    role: 0,
    shortDescription: {
      en: "Meta AI voice to image classification"
    },
    longDescription: {
      en: "Meta AI voice to image classification"
    },
    category: "ai",
    guide: {
      en: "{p}{n} [query]"
    }
  },
  onStart: async function ({ api, event, args }) {
    if (!args || args.length === 0) {
      api.sendMessage("Please provide a query for Meta AI.", event.threadID, event.messageID);
      return;
    }

    if (event.type === "message_reply") {
      if (event.messageReply.attachments[0]) {
        const attachment = event.messageReply.attachments[0];

        if (attachment.type === "audio") {
          const audioUrl = attachment.url;
          convertVoiceToText(audioUrl, api, event);
          return;
        } else if (attachment.type === "photo") {
          const imageURL = attachment.url;
          convertImageToCaption(imageURL, api, event);
          return;
        }
      }
    }

    try {
      const q = args.join(" ");
      const response = await axios.get(`https://hazeyy-apis-combine.kyrinwu.repl.co/api/llamav3/chat?prompt=${q}`);
      if (response.status === 200) {
        const generatedText = response.data.response;
        const formattedText = formatFont(generatedText);
        api.sendMessage(`${formattedText}`, event.threadID, event.messageID);
      } else {
        console.error("🔴 Error generating response from Meta AI.");
      }
    } catch (error) {
      console.error("🔴 Error:", error);
    }
  }
};
