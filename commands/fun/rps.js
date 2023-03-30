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
    const outcomes = { 
        rock: { scissors: 'I win', paper: 'you win', rock: 'its a draw'}, 
        paper: { scissors: 'You win', paper: 'its a draw', rock: 'I win'}, 
        scissors: { scissors: 'its a draw', paper: 'I win', rock: 'you win'}
    };
    // interaction.followUp(opts.botChoice.choice)
    const options = ['rock', 'paper', 'scissors'];
    const botChoice = options[Math.floor(Math.random()*3)];
    const choice = interaction.options.getString('choice').toLowerCase();
    // const regex = /\b(?:rock|paper|scisscors)\b/gi
    await interaction.followUp(`I chose ${botChoice} and you chose ${choice}, ${outcomes[botChoice][choice]}`);
  }
}