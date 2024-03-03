const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('magicconch')
  .setDescription('ask the magic conch a question and get an answer')
  .addStringOption(option => option.setName('question').setDescription('the question to ask the conch').setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply();
    const answers = ['Maybe Someday',
    'Nothing',
    'Neither',
    'I don\'t think so',
    'No',
    'Yes',
    'Try asking again',
    'You cannot get to the top by sitting on your bottom',
    'I see a new sauce in your future',
    'Ask next time',
    'Follow the seahorse'];
    const index = Math.floor(Math.random() * answers.length);
    const embed = new EmbedBuilder()
    .setAuthor({ name: 'Magic Conch', iconURL: 'https://static.wikia.nocookie.net/spongebob/images/e/e4/Magic_Conch_Shell.png/revision/latest?cb=20200602194627'})
    .setTitle(answers[index]);
    await interaction.followUp({ embeds: [embed], content: 'ALL HAIL THE MAGIC CONCH! ULULULULULU!' });
  }
}