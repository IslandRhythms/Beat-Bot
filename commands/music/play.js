const { SlashCommandBuilder, } = require("discord.js");
const ytdl = require("ytdl-core");
const { useMasterPlayer } = require('discord-player');
const player = useMasterPlayer();

module.exports = {
  data: new SlashCommandBuilder().setName('play')
  .setDescription('Given a youtube link, plays the song. Do not send playlists. Use the playlist command.')
  .addStringOption(option => option.setName('link').setDescription('link to the song to play').setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply();
    const link = interaction.options.getString('link');
    if (link.includes('list')) {
      return interaction.followUp({ content: 'Do not send playlists, use the playlist command instead', ephemeral: true });
    }
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel)
      return interaction.followUp({ content: "You need to be in a voice channel to play music!", ephemeral: true });
      // need to test this
      if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
        return interaction.followUp({ content: 'You must be in the same voice channel as me', ephemeral: true });
      }
    const permissions = voiceChannel.permissionsFor(interaction.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return interaction.followUp({ content: "I need the permissions to join and speak in your voice channel!", ephemeral: true });
    }
    const songInfo = await ytdl.getInfo(link);
    const song = {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
    };
    await player.play(voiceChannel, song.url, {leaveOnEmpty: true});
    return interaction.followUp(`${song.title} has been added to the queue!`);
  }
}