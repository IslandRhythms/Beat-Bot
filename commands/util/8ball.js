const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder().setName('8ball')
  .setDescription('shake the magic 8 ball and get an answer'),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const answers = ['It is certain', 'Reply hazy, try again', 'Don\'t count on it',
    'It is decidedly so', 'Ask again later', 'My reply is no', 'Without a doubt', 'Better not tell you now',
    'My sources say no', 'Yes definetly', 'Cannot predict now', 'Outlook not so good', 'You may rely on it', 'Concentrate and ask again',
    'Very doubtful', 'As I see it, yes', 'Most likely', 'Outlook good', 'Yes', 'Signs point to yes'];
    const choice = Math.floor(Math.random() * answers.length);
    const embed = new EmbedBuilder().setAuthor({ name: 'Magic 8 ball', iconURL: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Magic8ball.jpg' }).setTitle(answers[choice]);
    await interaction.followUp({ embeds: [embed] });
  }
}