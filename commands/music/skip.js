const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder().setName('skip')
  .setDescription('Skips the current or skips to specified song.')
  .addIntegerOption(option => option.setName('song').setDescription('the number of the song to skip to')),
  async execute(interaction) {
    await interaction.deferReply();
    const serverQueue = useQueue(interaction.guild.id);
    // need to check if bot is in same channel as user
    if (!interaction.member.voice.channel) {
      return interaction.followUp({ content: 'You must be in a voice channel to use this command', ephemeral: true });
    }
    if (!serverQueue) {
      return interaction.followUp({ content: 'nothing to skip', ephemeral: true });
    }
    const song = interaction.options.getInteger('song');
    if (song > serverQueue.length) {
      return interaction.followUp({ content: 'number indicated is bigger than the current queue', ephemeral: true });
    }
    if (song) {
      serverQueue.node.skipTo(song-1);
    } else {
      serverQueue.node.skip();
    }
    return interaction.followUp('skipping song!');
  }
}