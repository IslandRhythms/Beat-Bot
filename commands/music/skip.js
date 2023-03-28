const { SlashCommandBuilder } = require('discord.js');
const { queue } = require("../../index");

module.exports = {
  data: new SlashCommandBuilder().setName('skip')
  .setDescription('Skips the current or specified song. If the song is being looped, use unloop fist')
  .addIntegerOption(option => option.setName('song').setDescription('the number of the song to skip')),
  async execute(interaction) {
    const serverQueue = queue.get(interaction.guild.id);
    // need to check if bot is in same channel as user
    if (!interaction.member.voice.channel) {
      return interaction.reply({ content: 'You must be in a voice channel to use this command', ephemeral: true });
    }
    if (!serverQueue) {
      return interaction.reply({ content: 'nothing to skip', ephemeral: true });
    }
    const song = interaction.options.getInteger('song');
    if (song > serverQueue.length) {
      return interaction.reply({ content: 'number indicated is bigger than the current queue', ephemeral: true });
    }
    await interaction.reply('skipping song!');
    return serverQueue.songs.splice(song - 1, 1);
    // else serverQueue.connection.dispatcher.end();
  }
}