const tite = "https://tik-dl-api.diciper09.repl.co";

const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
	 name: 'tikdl',
	 aliases: ['tiktokdl'],
	 version: '1.0',
	 author: 'Eugene Aguilar',
	 countDown: 3,
	 role: 0,
	 shortDescription: 'tiktok downloader',
	 longDescription: 'tiktok downloader using tikvm api',
	 category: 'downloader',
	 guide: '{pn}',
  },

onStart: async function({ api, event, args }) {
	
  try {
	const link = args[0];
	if (!link) {
	 api.sendMessage("Usage: /tikdl <link>", event.threadID);
	 return;
	}
	api.sendMessage(`downloading...`, event.threadID);


	const response = await axios.get(`${tite}/tiktokdl?url=${encodeURIComponent(link)}`);

	const videoUrl = response.data.data.play;
	const userName = response.data.data.author.unique_id;
const usernickname = response.data.data.author.nickname;
const title = response.data.data.title;
const id = response.data.data.id;
const likes = response.data.data.digg_count;
const comments = response.data.data.comment_count;
const share = response.data.data.share_count;
const views = response.data.data.play_count;
const video = response.data.data.play;

	if (!videoUrl) {
	 api.sendMessage("No video found for the given link.", event.threadID);
	 return;
	}

	const videoResponse = await axios({
	 method: "get",
	 url: videoUrl,
	 responseType: "stream",
	});

	const filePath = path.join(__dirname, "cache", "tiktok_video.mp4");
	videoResponse.data.pipe(fs.createWriteStream(filePath));

	videoResponse.data.on("end", () => {
	 api.sendMessage(
		{
		 attachment: fs.createReadStream(filePath),
		 body: `Downloaded Successfully.\nUsername: @${userName}\nNickname: ${usernickname}\nTitle: ${title}\nUserID: ${id}\nLikes: ${likes}\nComments: ${comments}\nShare: ${share}\nViews: ${views}\nvideo: ${video}`,
		},
		event.threadID,
		() => fs.unlinkSync(filePath)
	 );
	});
  } catch (error) {
	console.error("Error:", error);
	api.sendMessage("An error occurred while processing the request.", event.threadID);
  }
}
};