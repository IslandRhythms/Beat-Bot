const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('createnote')
  .setDescription('saves information you write to the db')
  .addStringOption(option => option.setName('text').setDescription('The information to be stored')),
  async execute(interaction, conn) {
    await interaction.deferReply();
  }
}