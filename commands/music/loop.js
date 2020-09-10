const commando = require("discord.js-commando");
const ytdl = require("ytdl-core");
const queue = require("../../index");

class Loop extends commando.Command {
  constructor(client) {
    super(client, {
      name: "loop",
      group: "music",
      memberName: " loop",
      description: "loops the current song",
      throttling: {
        usages: 1,
        duration: 5,
      },
    });
  }

  async run(message) {
    const serverQueue = queue.get(message.guild.id);
    if (!serverQueue) return message.channel.send("nothing to loop!");
    //play(message.guild, serverQueue.songs[0]);
  }
}

/*
function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }
  const dispatcher = serverQueue.connection
    .play(
      ytdl(song.url, {
        quality: "highestaudio",
        highWaterMark: 1 << 25,
        filter: "audioonly",
      })
    )
    .on("finish", () => {
      play(guild, serverQueue.songs[0]);
    })
    .on("error", (error) => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}
*/

//module.exports = Loop;
