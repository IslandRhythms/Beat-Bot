const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder().setName('art').setDescription('get an artwork from the met or chicago'),
  async execute(interaction) {

  }
}