const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('guess')
  .setDescription('Beat Bot is thinking of a number, 1-10. Can you guess?')
  .addIntegerOption(option => option.setName('guess')
  .setDescription("User's guess")
  .setRequired(true)
  .setMaxValue(10)
  .setMinValue(1)),
  async execute(interaction) {
    const userGuess = interaction.options.getInteger('guess');
    const answer =  Math.floor(Math.random()*10)+1;
    if (userGuess == answer) {
        await interaction.reply("You're Correct!");
    } else {
        await interaction.reply(`Nope. My number was ${answer}`);
    }
  }
}