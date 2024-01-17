const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

// https://discord.js.org/#/docs/builders/main/class/SlashCommandBuilder?scrollTo=addMentionableOption

module.exports = {
  data: new SlashCommandBuilder().setName('pokemon')
  .setDescription('Get information about a pokemon')
  .addStringOption(option => option.setName('pokemon').setDescription('the pokemon name or national dex id').setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply();
    const pokemon = interaction.options.getString('pokemon');
    const embed = new EmbedBuilder();
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`).then(res => res.data);
    console.log('what is res', res);
    await interaction.followUp('Under Construction');
    // await interaction.followUp({ embeds: [embed] })
  }
}