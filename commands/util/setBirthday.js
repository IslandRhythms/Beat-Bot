const { SlashCommandBuilder } = require('discord.js');

// should probably be number options
module.exports = {
  data: new SlashCommandBuilder().setName('setbirthday')
  .setDescription('tell beat bot when your birthday is so he can wish you a happy birthday.')
  .addStringOption(option => option.setName('month').setDescription('the month you were born').addChoices(

  ))
  .addStringOption(option => option.setName('day').setDescription('the day you were born').addChoices(

  ))
  .addStringOption(option => option.setName('year').setDescription('the year you were born').addChoices(

  )),
  async execute(interaction) {
    await interaction.deferReply();
    await interaction.followUp();
  }
}