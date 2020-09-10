const commando = require("discord.js-commando");
const ytdl = require("ytdl-core");
const queue = require("../../index");

class Skip extends commando.Command {
  constructor(client) {
    super(client, {
      name: "skip",
      group: "music",
      memberName: "skip",
      description:
        "skips the current or specified song. Ex !?skip or !?skip 4 or !?skip 4 5 6 7 ...",
      throttling: {
        usages: 1,
        duration: 2,
      },
    });
  }

  async run(message) {
    const serverQueue = queue.get(message.guild.id);
    const args = message.content.split(/ +/);
    const patterns = new RegExp("[0-9]");
    console.log(args);
    let i = 1;
    if (!message.member.voice.channel)
      return message.channel.send(
        "You must be in a voice channel to skip songs"
      );
    if (!serverQueue) return message.channel.send("There is nothing to skip");
    if (args.length == 2 && patterns.test(args[1])) {
      if (parseInt(args[1]) > serverQueue.songs.length)
        return message.channel.send(
          "That number is bigger than the amount in the queue"
        );
      return serverQueue.songs.splice(args[1] - 1, 1);
    } else if (args.length > 2) {
      args.some((element, index, args) => {
        if (parseInt(args[index]) > serverQueue.songs.length)
          return message.channel.send(
            "You entered a number bigger than the total in the queue"
          );
        if (index != 0 && !patterns.test(element))
          return message.channel.send(
            "Make sure you enter real numbers or a number that doesn't exceed the queue"
          );
      });
      for (i; i < args.length; i++) {
        serverQueue.songs.splice(args[i] - 1, 1);
      }
    } else serverQueue.connection.dispatcher.end();

    //serverQueue.songs.shift();
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
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", (error) => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}
*/
module.exports = Skip;
