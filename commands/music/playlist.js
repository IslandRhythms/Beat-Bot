const ytdl = require("ytdl-core");
const { queue, repeat, repeatQueue } = require("../../index");
const ytpl = require("ytpl");
const { SlashCommandBuilder } = require("discord.js");


module.exports = {
  data: new SlashCommandBuilder().setName('playlist').setDescription('Plays the playlist. If passing a link to a single track, use the play command')
  .addStringOption(option => option.setName('link').setDescription('link to playlist').setRequired(true)),
  async execute(interaction) {
    const serverQueue = queue.get(interaction.guild.id);
    const playlist = interaction.options.getString('link');
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel)
      return interaction.reply({ content: "You need to be in a voice channel to play music!", ephemeral: true });
    const permissions = voiceChannel.permissionsFor(interaction.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return interaction.reply({ content: "I need the permissions to join and speak in your voice channel!", ephemeral: true });
    }

    if (!playlist.includes("list")) return interaction.reply({content: "Do not enter single tracks here, use the play command.", ephemeral: true});
    let info;
    if (!serverQueue) {
      const queueContract = {
        textChannel: interaction.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        backup: [],
        volume: 5,
        playing: true,
      };
      queue.set(interaction.guild.id, queueContract);

      let link = (await ytpl.getPlaylistID(playlist)).toString();
      (await ytpl(link, ytpl.options)).items.forEach((element) => {
        info = {
          title: element.title,
          url: element.shortUrl,
        };
        queueContract.songs.push(info);
        queueContract.backup.push(info);
      });
      console.log(queueContract.songs);

      try {
        var connection = await voiceChannel.join();
        queueContract.connection = connection;
        play(interaction.guild, queueContract.songs[0]);
      } catch (err) {
        console.log(err);
        queue.delete(interaction.guild.id);
        return interaction.reply({ content: err, ephemeral: true });
      }
    } else {
      let link = (await ytpl.getPlaylistID(playlist)).toString();
      (await ytpl(link, ytpl.options)).items.forEach((element) => {
        info = {
          title: element.title,
          url: element.shortUrl,
        };
        serverQueue.songs.push(info);
        serverQueue.backup.push(info);
      });
      console.log(serverQueue.songs);
      return interaction.reply("Playlist has been added to the queue!");
    }
  }

}

async function play(guild, song) {
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
      if (repeat) serverQueue.songs.shift();
      if (repeatQueue && serverQueue.songs.length === 0)
        serverQueue.songs.push(serverQueue.backup);
      play(guild, serverQueue.songs[0]);
    })
    .on("error", (error) => console.log(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}