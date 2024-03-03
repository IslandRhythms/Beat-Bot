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

/*
  This is part of the code we would have used to get an image that matches the dog fact,
  but the payload is not standardized ex: key is australian and value is shepherd but then
  bulldog is key and french is value :/
  ================================================================================================
    const data = await axios.get('https://dog.ceo/api/breeds/list/all').then(res => res.data);
    const list = data.message;
    const breeds = [];
    for (const key in list) {
      if (list[key].length) {
        for (let i = 0; i < list[key].length; i++) {
          breeds.push(`${key} ${list[key][i]}`);
        }
      } else {
        breeds.push(key);
      }
    }
*/