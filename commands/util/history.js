const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  // setting dm permission to false removes the option entirely from the list of available options.
  data: new SlashCommandBuilder().setName('history').setDescription("Tells you how long you've been a member of the server").setDMPermission(false),
  async execute(interaction) {
    return interaction.reply(`You joined on: ${new Date(interaction.member.joinedAt).toLocaleDateString()} at ${new Date(interaction.member.joinedAt).toLocaleTimeString()}`);
  }
}