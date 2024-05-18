
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const calendarMonths = require('../../resources/calendarMonths.json');
const calendarDays = require('../../resources/calendarDays.json');

// https://discord.js.org/#/docs/builders/main/class/SlashCommandBuilder?scrollTo=addMentionableOption
// need to have a check so that if someone puts more days than allowed in the month i.e. 32 days in december or 31 days in november
module.exports = {
  data: new SlashCommandBuilder().setName('numberfacts')
  .setDescription('Get a fact about a number')
  .addSubcommand(subcommand => 
    subcommand.setName('date').setDescription('get a fact about a date')
      .addNumberOption(option => option.setName('month').setDescription('the month').addChoices(...calendarMonths).setRequired(true))
      .addNumberOption(option => option.setName('day').setDescription('the day in the month').setMinValue(1).setMaxValue(31).setRequired(true)))
  .addSubcommand(subcommand => 
    subcommand.setName('math').setDescription('gets a math based fact about the number')
      .addNumberOption(option => option.setName('number').setDescription('the number').setRequired(true)))
  .addSubcommand(subcommand =>
    subcommand.setName('year').setDescription('the year you wish to look up a fact about')
      .addNumberOption(option => option.setName('number').setDescription('the year').setMinValue(1).setMaxValue(new Date().getFullYear()).setRequired(true)))
  .addSubcommand(subcommand =>
    subcommand.setName('trivia').setDescription('a general fact about the number')
      .addNumberOption(option => option.setName('number').setDescription('the number you want a fact to be about.').setRequired(true)))
  .addSubcommand(subcommand =>
    subcommand.setName('random').setDescription('a fact about a random number')
  ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const types = ['date', 'math', 'year', 'trivia']
    const type = interaction.options._subcommand;
    let url = '';
    if (type == 'date') {
      const month = interaction.options.getNumber('month');
      const day = interaction.options.getNumber('day');
      if (month == 2 && day > 29) {
        return interaction.followUp('February will only have at most 29 days so please try a valid date');
      }
      url = `http://numbersapi.com/${month}/${day}/${type}`
    } else if (type == 'random') {
      const index = Math.floor(Math.random() * types.length);
      url = `http://numbersapi.com/random/${types[index]}`
    } else {
      const number = interaction.options.getNumber('number');
      url = `http://numbersapi.com/${number}/${type}`
    }
    const res = await axios.get(url).then(res => res.data);
    if (res) {
      const embed = new EmbedBuilder();
      embed.setTitle(res ?? `Something went wrong`);
      embed.setFooter({ text: 'Possible thanks to http://numbersapi.com/'})
      return interaction.followUp({ embeds: [embed] })
    } else {
      return interaction.followUp('No fact found :(')
    }
  }
}