const { SlashCommandBuilder } = require('discord.js');
const advice = require("../../resources/fortune-cookie.json");

// https://discord.js.org/#/docs/builders/main/class/SlashCommandBuilder?scrollTo=addMentionableOption

module.exports = {
  data: new SlashCommandBuilder().setName('fortune')
  .setDescription('Get a fortune or give a fortune if you mention someone after the command call')
  .addUserOption(option => option.setName('target')
  .setDescription('The member to give a fortune')),
  async execute(interaction) {
    await interaction.deferReply();
    const user = interaction.options.getUser('target') ?? '';
    const fortune = advice[Math.floor(Math.random() * advice.length)];
    if (user) {
      return interaction.followUp(`${user} ${fortune}`);
    } else {
      return interaction.followUp(`${fortune}`);
    }
  }
}