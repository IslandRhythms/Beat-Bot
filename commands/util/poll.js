const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder().setName('poll').setDescription('starts a poll on the given topic')
  .addStringOption(option => option.setName('question').setDescription('the topic in the form of a question').setRequired(true))
  .addStringOption(option => option.setName('choices').setDescription('the possible choices, max 20, for the poll in the form of comma separated values'))
  .addRoleOption(option => option.setName('audience').setDescription('the people intended to respond to the poll')),
  async execute(interaction, conn) {
    await interaction.deferReply();
    await interaction.followUp(`Under construction`)
  }
}