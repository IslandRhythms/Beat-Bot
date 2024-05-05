const { SlashCommandBuilder } = require('discord.js');
const months = require('../../resources/calendarMonths.json');
const jsMonths = months.map(x => ({ name: x.name, value: x.value - 1 }));
const minimumYear = 1940;


module.exports = {
  data: new SlashCommandBuilder().setName('setbirthday')
  .setDescription('tell beat bot when your birthday is so he can wish you a happy birthday and other things.')
  .addNumberOption(option => option.setName('month').setDescription('the month you were born').addChoices(...jsMonths).setRequired(true))
  .addNumberOption(option => option.setName('day').setDescription('the day you were born').setMinValue(1).setMaxValue(31).setRequired(true))
  .addNumberOption(option => option.setName('year').setDescription('the year you were born').setMinValue(minimumYear).setMaxValue(new Date().getFullYear() - 15).setRequired(true)),
  async execute(interaction, conn) {
    await interaction.deferReply({ ephemeral: true });
    const { User } = conn.models;

    const user = await User.findOne({ discordId: interaction.user.id });
    if (!user) {
      return interaction.followUp('You are not logged in the db, please contact Beat to fix this.');
    }
    const month = interaction.options.getNumber('month');
    const day = interaction.options.getNumber('day');
    const year = interaction.options.getNumber('year');
    const date = new Date(year, month, day);
    user.birthday = date;
    await user.save();
    await interaction.followUp(`Birthday updated to ${date.toLocaleString()}`);
  }
}