const { SlashCommandBuilder } = require('discord.js')


module.exports = {
  data: new SlashCommandBuilder().setName('diceroll').setDescription('Rolls the indicated number dice')
  .addIntegerOption(option => option.setName('sides').setDescription('the number of sides the dice should have. If omitted, the default is 6').setMinValue(1))
  .addIntegerOption(option => option.setName('amount').setDescription('the number of dice to roll'))
  .addIntegerOption(option => option.setName('modifier').setDescription('the amount to add to the dice'))
  .addBooleanOption(option => option.setName('individual').setDescription('if the modifier should be added to each dice')),
  // what if the modifier is negative
  async execute(interaction) {
    await interaction.deferReply();
    const sides = interaction.options.getNumber('sides') ?? 6;
    const amount = interaction.options.getNumber('amount');
    const modifier = interaction.options.getNumber('modifier');
    const individual = interaction.options.getBoolean('individual');
    const rolls = [];
    let str = '';
    if (amount > 1) {
      for (let i = 0; i < amount; i++) {
        let roll = Math.floor(Math.random()*sides)+1;
        rolls.push(roll);
      }
    } else {
      let roll = Math.floor(Math.random()*sides)+1;
      if (modifier) {

      }
      return interaction.followUp(`You rolled a ${roll}`);
    }
  }
}