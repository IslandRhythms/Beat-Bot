const { SlashCommandBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder().setName('remind')
  .setDescription('set a reminder')
  .addStringOption(option => option.setName('message').setDescription('what to remind yourself about').setRequired(true))
  .addIntegerOption(option => option.setName('year').setDescription('the year').setRequired(true))
  .addIntegerOption(option => option.setName('month').setDescription('the month').setMaxValue(12).setMinValue(1).setRequired(true))
  .addIntegerOption(option => option.setName('day').setDescription('the day').setMinValue(1).setRequired(true))
  .addIntegerOption(option => option.setName('hours').setDescription('the hour, military time').setMaxValue(23).setMinValue(0))
  .addIntegerOption(option => option.setName('minute').setDescription('the minute').setMaxValue(59))
  .addIntegerOption(option => option.setName('second').setDescription('the second').setMaxValue(59))
  .addIntegerOption(option => option.setName('millisecond').setDescription('the millisecond').setMaxValue(999)),
  async execute(interaction, conn) {
    await interaction.deferReply();
    const { Task } = conn.models;
    const message = interaction.options.getString('message');
    const year = interaction.options.getInteger('year');
    const month = interaction.options.getInteger('month') - 1;
    const day = interaction.options.getInteger('day');
    const hour = interaction.options.getInteger('hours') ?? new Date().getHours();
    const minute = interaction.options.getInteger('minute') ?? new Date().getMinutes();
    const second = interaction.options.getInteger('second') ?? new Date().getSeconds();
    const millisecond = interaction.options.getInteger('millisecond') ?? new Date().getMilliseconds();
    const date = new Date(year, month, day, hour, minute, second, millisecond)
    await Task.schedule(`remind`, date.valueOf(), { message, discordId: interaction.user.id, reminderSetOn: new Date() });
    await interaction.followUp(`You will be sent a DM on ${date.toLocaleString()} about ${message}`);
  }
}