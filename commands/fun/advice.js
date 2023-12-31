const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder().setName('advice')
  .setDescription('Get some advice')
  .addStringOption(option => option.setName('query').setDescription('a topic for the advice to be about')),
  async execute(interaction) {
    await interaction.deferReply();
    let url = 'https://api.adviceslip.com/advice';
    const query = interaction.options.getString('query') ?? '';
    if (query) {
        url += `/search/${query}`;
    }
    const res = await axios.get(url).then(res => res.data);
    console.log('what is res', res);
    // need to handle error, search, and reg
    await interaction.followUp('Under Construction');
  }
}