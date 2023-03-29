const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder().setName('resume').setDescription('resumes playing the song'),
  async execute(interaction) {
    await interaction.deferReply();
    const queue = useQueue(interaction.guild.id);
    if (!voiceChannel)
      return interaction.followUp({ content: "You need to be in a voice channel to resume the music!", ephemeral: true });
      // need to test this
    if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      return interaction.followUp({ content: 'You must be in the same voice channel as me to resume the music', ephemeral: true });
    }
    if(queue.node.isPlaying()) {
      return interaction.followUp('Song is already playing');
    }
    queue.node.resume();
    return interaction.followUp('Resuming play. Use pause to pause the song');
  }
}