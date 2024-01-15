const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

// https://discord.js.org/#/docs/builders/main/class/SlashCommandBuilder?scrollTo=addMentionableOption

module.exports = {
  data: new SlashCommandBuilder().setName('cat')
  .setDescription('Get a random cat fact and random cat picture.'),
  async execute(interaction) {
    await interaction.deferReply();
    const embed = new EmbedBuilder();
    const fact = await axios.get('https://cat-fact.herokuapp.com/facts/random').then(res => res.data); // too many junk facts
    embed.setTitle('Cat Fact');
    embed.setDescription(fact.text);
    const image = await axios.get('https://api.thecatapi.com/v1/images/search').then(res => res.data);
    embed.setImage(image[0].url);
    embed.setFooter({ text: 'Possible thanks to https://cat-fact.herokuapp.com/facts/random and https://api.thecatapi.com/v1/images/search'})
    await interaction.followUp({ embeds: [embed] })
  }
}