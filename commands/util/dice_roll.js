const { SlashCommandBuilder } = require('discord.js')


module.exports = {
  data: new SlashCommandBuilder().setName('DiceRoll').setDescription('Rolls the indicated number dice').addIntegerOption(option => option.setName('sides').setDescription('the number of sides the dice should have. If omitted, the default is 6')),
  async execute(interaction) {
    const sides = interaction.options.getNumber('sides') ?? 20;
    const roll = Math.floor(Math.random()*sides)+1;
    await interaction.reply(`You rolled a ${roll}`);
  }
}