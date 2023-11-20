const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('createnote')
  .setDescription('saves information you write to the db')
  .addStringOption(option => option.setName('text').setDescription('The information to be stored'))
  .addStringOption(option => option.setName('users').setDescription('A comma separated list of users that can access the note.'))
  .addRoleOption(option => option.setName('roles').setDescription('the roles that have access to the note.')),
  async execute(interaction, conn) {
    await interaction.deferReply();
  }
}