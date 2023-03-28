const { SlashCommandBuilder } = require("discord.js");
const { queue, repeat} = require("../../index");

module.exports = {
  data: new SlashCommandBuilder().setName('unloop').setDescription('ends the loop of the song currently playing'),
  async execute(interaction) {
    const serverQueue = queue.get(interaction.guild.id);
    // need to check if bot is in same channel as user
    if (!interaction.member.voice.channel) {
      return interaction.reply({ content: 'You must be in a voice channel to use this command', ephemeral: true });
    }
    if (!serverQueue) {
      return interaction.reply({ content: 'nothing to unloop!', ephemeral: true });
    }
    if (!repeat) {
      return interaction.reply({ content: 'Already unlooped!', ephemeral: true });
    }
    repeat = false;
    return interaction.reply('Will unloop boss!');
  }
}
