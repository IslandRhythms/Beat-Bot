const ytpl = require("ytpl");
const { SlashCommandBuilder } = require("discord.js");
const { useMasterPlayer } = require('discord-player');
const player = useMasterPlayer();

module.exports = {
  data: new SlashCommandBuilder().setName('playlist').setDescription('Plays the playlist. If passing a link to a single track, use the play command')
  .addStringOption(option => option.setName('link').setDescription('link to playlist').setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply();
    const playlist = interaction.options.getString('link');
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      return interaction.followUp({ content: "You need to be in a voice channel to play music!", ephemeral: true });
    }
    if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      return interaction.followUp({ content: 'You must be in the same voice channel as me', ephemeral: true });
    }
    const permissions = voiceChannel.permissionsFor(interaction.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return interaction.followUp({ content: "I need the permissions to join and speak in your voice channel!", ephemeral: true });
    }

    if (!playlist.includes("list")) return interaction.followUp({content: "Do not enter single tracks here, use the play command.", ephemeral: true});
    let link = (await ytpl.getPlaylistID(playlist)).toString();
    const songs = await ytpl(link, ytpl.options);
    await interaction.followUp('Playlist currently being added. Depending on how big the playlist is this may take some time.');
    for (let i = 0; i < songs.items.length; i++) {
      const info = {};
      info.title = songs.items[i].title;
      info.url = songs.items[i].shortUrl;
      await player.play(voiceChannel, info.url, { leaveOnEmpty: true });
    }
  }

}