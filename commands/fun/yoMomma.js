const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder().setName('yomomma').setDescription('sends a yo momma joke')
  .addUserOption(option => option.setName('target').setDescription('the person to send a you momma joke to.')),
  async execute(interaction) {
    await interaction.deferReply();
    const res = await axios.get('https://yomomma-api.herokuapp.com/jokes').then(res => res.data);
    console.log(res);
    const user = interaction.options.getUser('target') ?? '';
    if (user) {
      return interaction.followUp(`${user} ${res.joke}`);
    } else {
      return interaction.followUp(`${res.joke}`);
    }
  }
}