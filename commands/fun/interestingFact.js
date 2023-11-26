const { SlashCommandBuilder } = require('discord.js');
const interestingFact = require('../../automations/interestingFact');

module.exports = {
  data: new SlashCommandBuilder().setName('fact').setDescription('gets a random interesting fact.'),
  async execute(interaction, conn) {
    await interaction.deferReply();
    const result = await interestingFact(conn);
    await interaction.followUp(result);
  }
}