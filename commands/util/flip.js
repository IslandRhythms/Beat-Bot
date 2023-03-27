const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('Flip').setDescription('Flips a coin, feeling lucky?'),
  async execute(interaction) {

    await interaction.deferReply();
    await interaction.channel.send('The coin is in the air and ...');
    const coin = Math.floor(Math.random() * 2);
    setTimeout(airTime, 3000);

    async function airTime() {
      if (coin == 0) {
        await interaction.reply("It's Heads!")
      } else {
        await interaction.reply("It's Tails!");
      }
    }
  }
}