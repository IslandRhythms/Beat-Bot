const { SlashCommandBuilder } = require('discord.js');
const yoMommaJokes = require('../../resources/jokes.json');

module.exports = {
  data: new SlashCommandBuilder().setName('yomomma').setDescription('sends a yo momma joke')
  .addUserOption(option => option.setName('target').setDescription('the person to send a you momma joke to.')),
  async execute(interaction) {
    await interaction.deferReply();
    const user = interaction.options.getUser('target') ?? '';
    const joke = yoMommaJokes[Math.floor(Math.random() * yoMommaJokes.length)];
    if (user) {
      return interaction.followUp(`${user} ${joke}`);
    } else {
      return interaction.followUp(`${joke}`);
    }
  }
}