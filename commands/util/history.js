const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('History').setDescription("Tells you how long you've been a member of the server"),
  async execute(interaction) {
    interaction.reply(`You joined on: ${new Date(interaction.guild.joinedAt).toLocaleDateString()} at ${new Date(interaction.guild.joinedAt).toLocaleTimeString()}`);
  }
}