const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

// https://discord.js.org/#/docs/builders/main/class/SlashCommandBuilder?scrollTo=addMentionableOption

module.exports = {
  data: new SlashCommandBuilder().setName('dog')
  .setDescription('Get a random dog fact and random dog picture.'),
  async execute(interaction) {
    await interaction.deferReply();
    const embed = new EmbedBuilder();
    const fact = await axios.get('https://dogapi.dog/api/v2/facts?limit=1').then(res => res.data);
    embed.setTitle('Dog Fact');
    embed.setDescription(fact.data[0].attributes.body);
    const image = await axios.get('https://dog.ceo/api/breeds/image/random ').then(res => res.data);
    embed.setImage(image.message);
    embed.setFooter({ text: 'Possible thanks to https://dog.ceo/dog-api/documentation/ and https://dogapi.dog/docs/api-v2'})
    await interaction.followUp({ embeds: [embed] })
  }
}