const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder().setName('pause').setDescription('pauses the song playing'),
  async execute(interaction) {
    await interaction.deferReply();
    const queue = useQueue(interaction.guild.id);
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel)
      return interaction.followUp({ content: "You need to be in a voice channel to pause the music!", ephemeral: true });
      // need to test this
    if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      return interaction.followUp({ content: 'You must be in the same voice channel as me to pause the music', ephemeral: true });
    }
    if (queue.node.isPaused()) {
      return interaction.followUp({ content: 'Song is already paused', ephemeral: true });
    }
    queue.node.pause();
    return interaction.followUp('Song paused. Use resume to continue playing the song');
  }
}