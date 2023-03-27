const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder().setName('rps')
  .setDescription('Play rock paper scissors against the bot.')
  .addStringOption(option => option.setName('choice')
  .setDescription("The player's choice")
  .setRequired(true)
  .addChoices({ name: 'rock', value: 'rock'}, { name: 'paper', value: 'paper'}, { name: 'scissors', value: 'scissors'})),
  async execute(interaction) {
    await interaction.deferReply();
    const options = ['rock', 'paper', 'scissors'];
    const botChoice = options[Math.floor(Math.random()*3) + 1];
    const choice = interaction.options.getString('choice').toLowerCase();
    // const regex = /\b(?:rock|paper|scisscors)\b/gi
    if (botChoice == 'rock' && choice == 'paper') {
        await interaction.reply('I chose rock, I win!');
    } else if (botChoice == 'paper' && choice == 'scissors') {
        await interaction.reply('I chose paper, I win!')
    } else if (botChoice == 'scissors' && choice == 'paper') {
        await interaction.reply('I chose scissors, I win!');
    } else if (botChoice == choice) {
        await interaction.reply("It's a draw")
    } else {
        await interaction.reply(`You chose ${choice} and I chose ${botChoice}, you win!`);
    }
  }
}