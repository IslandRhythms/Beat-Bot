const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('generatename').setDescription('generates a random name'),
  async execute(interaction) {
    await interaction.reply("I don't do anything right now.");
  }
}