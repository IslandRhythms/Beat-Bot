const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder().setName('advice')
  .setDescription('Get some advice'),
  async execute(interaction) {
    await interaction.deferReply();
    const url = 'https://api.adviceslip.com/advice';

    const { slip } = await axios.get(url).then(res => res.data);
    if (!slip) {
      return interaction.followUp('No advice found');
    }
    await interaction.followUp(slip.advice);
  }
}