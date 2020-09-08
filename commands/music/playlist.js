const commando = require("discord.js-commando");
const ytdl = require("ytdl-core");
const queue = require("../../index");
//const ytpl = require("ytpl");

class Playlist extends commando.Command {
  constructor(client) {
    super(client, {
      name: "playlist",
      group: "music",
      memberName: "playlist",
      description: "adds a playlist to play",
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

    if (!args[1].includes("list"))
      return message.channel.send(
        "Do not enter single tracks here, use the play command."
      );
    /*
    ytpl(ytpl.getPlaylistID(args[1]), function (err, playlist) {
      if (err) throw err;
      console.log(playlist.items.url_simple);
    });
    */
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
      //queueContract.push(playlist);
      //

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
      //
      console.log(serverQueue.songs);
      return message.channel.send("Playlist has been added to the queue");
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

//module.exports = Playlist;
