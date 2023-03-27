const { SlashCommandBuilder } = require('discord.js');
const advice = require("../../fortune-cookie.json");

module.exports = AdviceCommand;

module.exports = {
  data: new SlashCommandBuilder().setName('fortune').setDescription('Get a fortune or give a fortune if you mention someone after the command call').addUserOption(option => option.setName('target').setDescription('The member to give a fortune')),
  async execute(interaction) {
    await interaction.deferReply();
    const user = interaction.options.getUser('target') ?? '';
    const fortune = advice[Math.floor(Math.random() * advice.length)];
    if (user) {
      interaction.channel.send(`@${user.username} ${fortune}`);
    } else {
      interaction.reply(`${fortune}`)
    }
  }
}