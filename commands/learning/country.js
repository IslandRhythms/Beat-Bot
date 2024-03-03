
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder().setName('country')
  .setDescription('Get information about a country')
  .addStringOption(option => option.setName('country').setDescription('the name of the country')),
  async execute(interaction) {
    await interaction.deferReply();
    const country = interaction.options.getString('country');
    const embed = new EmbedBuilder();
    await interaction.followUp({ embeds: [embed] })
  }
}