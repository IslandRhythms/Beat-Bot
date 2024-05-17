const { SlashCommandBuilder } = require('discord.js');
const insult = require('../../resources/insults.json');

module.exports = {
  data: new SlashCommandBuilder().setName('burn').setDescription('Sends a sick burn and will burn a user if mentioned in the command call').addUserOption(option => option.setName('target').setDescription('the user to burn')),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const user = interaction.options.getUser('target') ?? '';
    const burn = insult[Math.floor(Math.random() * insult.length)];
    if (user) {
      return interaction.followUp(`${user} ${burn}`);
    } else {
      return interaction.followUp(`${burn}`);
    }
  }
}