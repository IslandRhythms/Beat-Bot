const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('vote').setDescription('Votes on the issue at hand'),
  async execute(interaction) {
    const democracy = Math.floor(Math.random()*2);
    if (democracy == 0) {
      return interaction.reply(`I vote against ${interaction.user}`);
    } else {
      return interaction.reply(`I vote with ${interaction.user}`);
    }
  }
}