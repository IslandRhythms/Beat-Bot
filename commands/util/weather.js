const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder().setName('weather').setDescription('gets the weather given a latitude and longitude.')
  .addNumberOption(option => option.setName('latitude').setDescription('the latitude of the desired location.').setRequired(true))
  .addNumberOption(option => option.setName('longitude').setDescription('the longitude of the desired location.').setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply();
    const latitude = interaction.options.getNumber('latitude');
    const longitude = interaction.options.getNumber('longitude');
    const res = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&temperature_unit=fahrenheit`).then(res => res.data);
    console.log('what is res', res);
    await interaction.followUp('Under Construction');
  }
}