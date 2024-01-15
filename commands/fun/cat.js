const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

// https://discord.js.org/#/docs/builders/main/class/SlashCommandBuilder?scrollTo=addMentionableOption

module.exports = {
  data: new SlashCommandBuilder().setName('cat')
  .setDescription('Get a random cat fact and random cat picture.'),
  async execute(interaction) {
    await interaction.deferReply();
    const embed = new EmbedBuilder();
    const fact = await axios.get('https://cat-fact.herokuapp.com/facts/random').then(res => res.data);
    embed.setTitle('Cat Fact');
    console.log('what is fact', fact);
    embed.setDescription(fact);
    const image = await axios.get('https://api.thecatapi.com/v1/images/search').then(res => res.data);
    console.log('what is image', image);
    return interaction.followUp('Under Construction');
    embed.setImage(image);
    embed.setFooter({ text: 'Possible thanks to https://dog.ceo/dog-api/documentation/ and https://dogapi.dog/docs/api-v2'})
    await interaction.followUp({ embeds: [embed] })
  }
}