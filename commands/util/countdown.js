const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('countdown').setDescription("create a visible timer")
  .addNumberOption(option => option.setName('time').setDescription('what time, in minutes, to begin the countdown')),
  async execute(interaction) {
    await interaction.deferReply();
    await interaction.followUp(`Under Construction`)
  }
}