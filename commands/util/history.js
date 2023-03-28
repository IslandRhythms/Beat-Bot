const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('history').setDescription("Tells you how long you've been a member of the server"),
  async execute(interaction) {
    return interaction.reply(`You joined on: ${new Date(interaction.member.joinedAt).toLocaleDateString()} at ${new Date(interaction.member.joinedAt).toLocaleTimeString()}`);
  }
}