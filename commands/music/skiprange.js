const { SlashCommandBuilder } = require("discord.js");
const { queue } = require("../../index");

module.exports = {
  data: new SlashCommandBuilder().setName('skiprange')
  .setDescription('Skips all songs in the given range')
  .addIntegerOption(option => option.setName('start')
   .setDescription('starting index').setRequired(true))
  .addIntegerOption(option => option.setName('end').setDescription('end index').setRequired(true)),
  async execute(interaction) {
    const serverQueue = queue.get(interaction.guild.id);
    const start = interaction.options.getInteger('start');
    const end = interaction.options.getInterger('end');
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