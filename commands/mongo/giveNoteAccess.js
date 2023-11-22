const { SlashCommandBuilder } = require('discord.js');
const parseDateString = require('../../parseDateString');

module.exports = {
  data: new SlashCommandBuilder().setName('givenoteaccess')
  .setDescription('gives a user or role access to all of your notes. Add options to filter the notes.')
  .addStringOption(option => option.setName('title').setDescription('The title of the note'))
  .addStringOption(option => option.setName('when').setDescription('when the note was created in the form MMDDYYYY'))
  .addRoleOption(option => option.setName('role').setDescription('the role to allow access'))
  .addUserOption(option => option.setName('user').setDescription('the user to give access')),
  async execute(interaction, conn) {
    await interaction.deferReply();
  }
}