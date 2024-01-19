const { SlashCommandBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder().setName('updatefavorites').setDescription('update your favorite stuff.')
  .addSubcommand(subcommand => subcommand.setName('games').setDescription('update your favorite games')
    .addStringOption(option => option.setName('game').setDescription('the name of the game'))
    .addStringOption(option => option.setName('link').setDescription('a link to the game')))
  .addSubcommand(subcommand => subcommand.setName('music').setDescription('update your favorite music')
    .addStringOption(option => option.setName('music').setDescription('name of the song'))
    .addStringOption(option => option.setName('link').setDescription('link to the song')))
  .addSubcommand(subcommand => subcommand.setName('movies').setDescription('update your favorite movies')
    .addStringOption(option => option.setName('movie').setDescription('the name of the movies')))
  .addSubcommand(subcommand => subcommand.setName('shows').setDescription('update your favorite shows')
    .addStringOption(option => option.setName('show').setDescription('the name of the show')))
  .addSubcommand(subcommand => subcommand.setName('foods').setDescription('update your favorite foods')
    .addStringOption(option => option.setName('food').setDescription('the name of the food'))),
  async execute(interaction, conn) {
    await interaction.deferReply();

    const { User } = conn.models;

    const day = interaction.options.getString('day');

    const user = await User.findOne({ discordId: interaction.user.id });
    
  }
}