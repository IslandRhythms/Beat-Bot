const { SlashCommandBuilder } = require('discord.js');
const parseDateString = require('../../parseDateString');

module.exports = {
  data: new SlashCommandBuilder().setName('revokenoteaccess')
  .setDescription('removes a user from all notes you have given them access. Add options to filter the notes.')
  .addStringOption(option => option.setName('title').setDescription('The title of the note'))
  .addStringOption(option => option.setName('when').setDescription('when the note was created in the form MMDDYYYY')),
  async execute(interaction, conn) {
    await interaction.deferReply();
  }
}