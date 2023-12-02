const { SlashCommandBuilder } = require('discord.js');
const interestingFact = require('../../automations/interestingFact');

// consider only allowing the bot to run this command.
module.exports = {
  cooldown: 60,
  data: new SlashCommandBuilder().setName('fact').setDescription('gets a random interesting fact.'),
  async execute(interaction) {
    await interaction.deferReply();
    const result = await interestingFact();
    await interaction.followUp(result);
  }
}