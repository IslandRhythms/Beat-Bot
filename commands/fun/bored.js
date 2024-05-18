const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const querystring = require('querystring');

module.exports = {
  data: new SlashCommandBuilder().setName('bored')
  .setDescription('Suggests a fun activity')
  .addStringOption(option => option.setName('type')
    .addChoices(
      { name: 'education', value: 'education'},
      { name: 'recreational', value: 'recreational'},
      { name: 'social', value: 'social'},
      { name: 'diy', value: 'diy'},
      { name: 'charity', value: 'charity'},
      { name: 'cooking', value: 'cooking'},
      { name: 'relaxation', value: 'relaxation'},
      { name: 'music', value: 'music'},
      { name: 'busywork', value: 'busywork'}
    )
    .setDescription("The type of activity."))
  .addIntegerOption(option => option.setName('participants')
    .setDescription('the number of people that this activity could involve')
    .setMinValue(0))
  .addNumberOption(option => option.setName('minprice')
    .setDescription('the min factor for cost with 0 being most afforable. Equate to max price for a specific price.')
    .setMinValue(0)
    .setMaxValue(1))
  .addNumberOption(option => option.setName('maxprice')
  .setDescription('the max factor for cost with 1 being the most expensive. Equate to min price for a specific price.')
  .setMinValue(0)
  .setMaxValue(1))
  .addNumberOption(option => option.setName('minaccessibility')
    .setDescription('a factor for how easy an event is to do with 0 being the easiest. Equate to max for specific number.')
    .setMinValue(0)
    .setMaxValue(1))
  .addNumberOption(option => option.setName('maxaccessibility')
  .setDescription('a factor for how easy an event is to do with 1 being the hardest. Equate to min for specific number.')
  .setMinValue(0)
  .setMaxValue(1)),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    let link = 'http://www.boredapi.com/api/activity/';
    console.log('what is options', interaction.options, typeof interaction.options);
    const data = {
      type: interaction.options.getString('type'),
      participants: interaction.options.getInteger('participants'),
    }
    const minPrice = interaction.options.getNumber('minprice') ?? '';
    const maxPrice = interaction.options.getNumber('maxprice') ?? '';
    const minAcc = interaction.options.getNumber('minaccessibility') ?? '';
    const maxAcc = interaction.options.getNumber('maxaccessibility') ?? '';
    if (minPrice && maxPrice) {
      data.minprice = Math.min(minPrice, maxPrice);
      data.maxprice = Math.max(minPrice, maxPrice);
    } else {
      data.price = Math.max(minPrice, maxPrice);
    }
    if (minAcc && maxAcc) {
      data.minaccessibility = Math.min(minAcc, maxAcc);
      data.maxaccessibility = Math.max(minAcc, maxAcc);
    } else {
      data.accessibility = Math.max(minAcc, maxAcc);
    }

    const params = querystring.stringify(data);
    console.log('what is link', link, 'what is params', params);
    const request = link + '?' + params;
    const activity = await axios.get(params ? request : link).then(res => res.data);
    console.log('what is the activity', activity);
    if (activity.error) {
      await interaction.followUp(`${activity.error}`);
    } else {
      await interaction.followUp(`Suggestion: ${activity.activity}\n${activity.link}`);
    }
  }
}