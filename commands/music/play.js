const { SlashCommandBuilder } = require("discord.js");
const ytdl = require("ytdl-core");
const { queue, repeat, repeatQueue } = require("../../index");

module.exports = {
  data: new SlashCommandBuilder().setName('play')
  .setDescription('Given a youtube link, plays the song. Do not send playlists. Use the playlist command.')
  .addStringOption(option => option.setName('link').setDescription('link to the song to play').setRequired(true)),
  async execute(interaction) {
    const link = interaction.options.getString('link');
    const serverQueue = queue.get(interaction.guild.id);
    if (link.includes('list')) {
      return interaction.reply({ content: 'Do not send playlists, use the playlist command instead', ephemeral: true });
    }
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel)
      return interaction.reply({ content: "You need to be in a voice channel to play music!", ephemeral: true });
    const permissions = voiceChannel.permissionsFor(interaction.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return interaction.reply({ content: "I need the permissions to join and speak in your voice channel!", ephemeral: true });
    }
    const songInfo = await ytdl.getInfo(link);
    const song = {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
    };

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
      queueContract.songs.push(song);
      queueContract.backup.push(song);
      try {
        var connection = await voiceChannel.join();
        queueContract.connection = connection;
        play(interaction.guild, queueContract.songs[0]);
      } catch (err) {
        console.log(err);
        queue.delete(interaction.guild.id);
        return interaction.reply({content: err, ephemeral: true});
      }
    } else {
      serverQueue.songs.push(song);
      serverQueue.backup.push(song);
      console.log(serverQueue.songs);
      return interaction.reply(`${song.title} has been added to the queue!`);
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
  const dispatcher = await serverQueue.connection
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
    .on("error", (error) => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}