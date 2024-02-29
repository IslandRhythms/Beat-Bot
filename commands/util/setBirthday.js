const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const months = require('../../calendarMonths.json');
const jsMonths = months.map(x => x.value -= 1);
const minimumYear = 1940;

// should probably be number options
// Search on google: chinese zodiac descriptions printable
// and have that as part of the happy birthday message
module.exports = {
  data: new SlashCommandBuilder().setName('setbirthday')
  .setDescription('tell beat bot when your birthday is so he can wish you a happy birthday and other things.')
  .addNumberOption(option => option.setName('month').setDescription('the month you were born').addChoices(...jsMonths).setRequired(true))
  .addNumberOption(option => option.setName('day').setDescription('the day you were born').setMinValue(1).setMaxValue(31).setRequired(true))
  .addNumberOption(option => option.setName('year').setDescription('the year you were born').setMinValue(minimumYear).setMaxValue(new Date().getFullYear() - 15).setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply();
    const month = interaction.options.getNumber('month');
    const day = interaction.options.getNumber('day');
    const year = interaction.options.getYear('year');
    const date = new Date(year, month, day);
    await interaction.followUp();
  }
}