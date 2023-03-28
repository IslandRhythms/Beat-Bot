const { SlashCommandBuilder } = require("discord.js");
const { queue } = require("../../index");

module.exports = {
  data: new SlashCommandBuilder().setName('SkipRange')
  .setDescription('Skips all songs in the given range')
  .addIntegerOption(option => option.setName('Start')
   .setDescription('starting index').setRequired(true))
  .addIntegerOption(option => option.setName('End').setDescription('end index').setRequired(true)),
  async execute(interaction) {
    const serverQueue = queue.get(interaction.guild.id);
    const start = interaction.options.getInteger('Start');
    const end = interaction.options.getInterger('End');
    // need to check if bot is in same channel as user
    if (!interaction.member.voice.channel) {
      return interaction.reply({ content: 'You must be in a voice channel to use this command', ephemeral: true });
    }
    if (start > serverQueue.length || end > serverQueue.length) {
      return interaction.reply({ content: 'The range exceeds the queue size', ephemeral: true });
    }
    serverQueue.songs.splice(start - 1, end - start);
    return interaction.reply('Songs removed!');
  }
}