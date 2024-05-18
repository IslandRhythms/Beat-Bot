const { SlashCommandBuilder, } = require("discord.js");
const { useMainPlayer } = require('discord-player');


module.exports = {
  data: new SlashCommandBuilder().setName('play')
  .setDescription('Given a youtube link, plays the song/playlist.')
  .addStringOption(option => option.setName('link').setDescription('link to the song/playlist to play').setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply();
    const player = useMainPlayer();
    const link = interaction.options.getString('link');
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
    const url = await player.search(link);
    await player.play(voiceChannel, url, {leaveOnEmpty: true});
    return interaction.followUp(`**${url._data.playlist ? url._data.playlist.title : url._data.tracks[0].title}** has been added to the queue!`);
  }
}