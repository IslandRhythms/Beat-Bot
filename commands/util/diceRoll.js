const { SlashCommandBuilder } = require('discord.js')


module.exports = {
  data: new SlashCommandBuilder().setName('diceroll').setDescription('Rolls the indicated number dice')
  .addIntegerOption(option => option.setName('sides').setDescription('the number of sides the dice should have. If omitted, the default is 6').setMinValue(1))
  .addIntegerOption(option => option.setName('amount').setDescription('the number of dice to roll'))
  .addIntegerOption(option => option.setName('modifier').setDescription('the amount to add to the dice'))
  .addBooleanOption(option => option.setName('individual').setDescription('if the modifier should be added to each dice'))
  .addBooleanOption(option => option.setName('private').setDescription('set to true if you want anyone to see the result of the roll. default is false')),
  // what if the modifier is negative
  async execute(interaction) {
    const private = interaction.options.getBoolean('private');
    await interaction.deferReply({ ephemeral: private });
    const sides = interaction.options.getInteger('sides') ?? 6;
    const amount = interaction.options.getInteger('amount');
    const modifier = interaction.options.getInteger('modifier');
    const individual = interaction.options.getBoolean('individual');
    const rolls = [];
    let str = '';
    if (amount > 1) {
      for (let i = 0; i < amount; i++) {
        let roll = Math.floor(Math.random()*sides)+1;
        if (individual && modifier) {
          str += `${i+1}. ${roll} + (${modifier}) = ${roll + modifier}\n`;
        }
        rolls.push(roll);
      }
      if (individual && modifier) {
        return interaction.followUp(str);
      } else {
        return interaction.followUp(`${rolls.join('+')} + (${modifier ? modifier : 0}) = ${(rolls.reduce((total, item) => total + item)) + (modifier ? modifier : 0)}`)
      }
      
    } else {
      let roll = Math.floor(Math.random()*sides)+1;
      return interaction.followUp(`${modifier ? `${roll} + (${modifier}) = ${roll + modifier}`: `${roll}`}`);
    }
  }
}