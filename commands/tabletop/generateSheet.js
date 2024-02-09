
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('generatesheet')
  .setDescription('generates an html page to enter character information'),
  async execute(interaction) {
    await interaction.deferReply();
    await interaction.followUp('Under Construction')
  }
}