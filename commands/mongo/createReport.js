const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// use the modal component
module.exports = {
  data: new SlashCommandBuilder().setName('createreport').setDescription('report a bug with beat bot'),
  async execute(interaction, conn) {

  }
}