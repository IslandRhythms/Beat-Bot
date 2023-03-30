const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder().setName('flip').setDescription('Flips a coin, feeling lucky?'),
  async execute(interaction) {

    // await interaction.deferReply();
    await interaction.reply('The coin is in the air and ...');
    const coin = Math.floor(Math.random() * 2);
    setTimeout(airTime, 3000);

    async function airTime() {
      if (coin == 0) {
        return interaction.channel.send("It's Heads!")
      } else {
        return interaction.channel.send("It's Tails!");
      }
    }
  }
}