const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('Vote').setDescription('Votes on the issue at hand'),
  async execute(interaction) {
    const democracy = Math.floor(Math.random()*2);
    if (democracy == 0) {
      interaction.reply(`I vote against ${interaction.client.user}`);
    } else {
      interaction.reply(`I vote with ${interaction.client.user}`);
    }
  }
}