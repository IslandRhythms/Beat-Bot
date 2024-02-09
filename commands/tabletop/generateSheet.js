
const { SlashCommandBuilder, MessageAttachment } = require('discord.js');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder().setName('generatesheet')
  .setDescription('generates an html page to enter character information'),
  async execute(interaction) {
    await interaction.deferReply();
    await interaction.followUp({
      content: 'Here you go! Download the file, make your changes, save, and then upload using /uploadCharacter',
      files: [{ attachment: __dirname+'../../../tableTopCharacterInformation.html', name: `${interaction.user.username}.html` }]
    });
  }
}