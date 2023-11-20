const { SlashCommandBuilder } = require('discord.js');
const parseDateString = require('../../parseDateString');

module.exports = {
  data: new SlashCommandBuilder().setName('getnote')
  .setDescription('gets all notes you have access to. Pass args to filter notes.')
  .addStringOption(option => option.setName('title').setDescription('the title of the note.'))
  .addStringOption(option => option.setName('when').setDescription('when the note was created in the form MMDDYYYY')),
  async execute(interaction, conn) {
    await interaction.deferReply();
  }
}