const commando = require("discord.js-commando");
const ytdl = require("ytdl-core");
const queue = require("../../index");

class Play extends commando.Command {
  constructor(client) {
    super(client, {
      name: "play",
      group: "music",
      memberName: "play",
      description: "plays a song",
    });
  }

  async run(message) {
    const serverQueue = queue.get(message.guild.id);
    const args = message.content.split(/ +/);
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.channel.send(
        "You need to be in a voice channel to play music!"
      );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send(
        "I need the permissions to join and speak in your voice channel!"
      );
    }
    if (message.content.includes("list"))
      return message.channel.send(
        "Do not enter playlists here, use the playlist command."
      );
    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
      title: songInfo.title,
      url: songInfo.video_url,
    };

    if (!serverQueue) {
      const queueContract = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true,
      };
      queue.set(message.guild.id, queueContract);
      queueContract.songs.push(song);
      try {
        var connection = await voiceChannel.join();
        queueContract.connection = connection;
        play(message.guild, queueContract.songs[0]);
      } catch (err) {
        console.log(err);
        queue.delete(message.guild.id);
        return message.channel.send(err);
      }
    } else {
      serverQueue.songs.push(song);
      console.log(serverQueue.songs);
      return message.channel.send(`${song.title} has been added to the queue!`);
    }
  }
}

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

module.exports = Play;
