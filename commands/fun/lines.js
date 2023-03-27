const { SlashCommandBuilder } = require('discord.js');
const lines = require('../../lines.json');

module.exports = {
  data: new SlashCommandBuilder().setName('PickUpLine').setDescription('get a random pick up line or send if you mention a user in the command call').addUserOption(option => option.setName('target').setDescription('The member to attempt to swoon')),
  async execute(interaction) {
    await interaction.deferReply();
    const user = interaction.options.getUser('target') ?? '';
    const pickUpLine = lines[Math.floor(Math.random() * lines.length)];
    if (user) {
      interaction.channel.send(`@${user.username} ${pickUpLine}`);
    } else {
      interaction.reply(`${pickUpLine}`)
    }
  }
}