const { SlashCommandBuilder } = require('discord.js');
require('../../config');

module.exports = {
  data: new SlashCommandBuilder().setName('sourcecode').setDescription('provides a link to the Bot\'s code.'),
  async execute(interaction) {
    await interaction.reply({ content: process.env.REPOSITORY, ephemeral: true });
  }
}