const { SlashCommandBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder().setName('updatefavorites').setDescription('update your favorite stuff.')
  .addSubcommand(subcommand => subcommand.setName('games').setDescription('update your favorite games')
    .addStringOption(option => option.setName('game').setDescription('the name of the game').setRequired(true))
    .addStringOption(option => option.setName('link').setDescription('a link to the game')))
  .addSubcommand(subcommand => subcommand.setName('music').setDescription('update your favorite music')
    .addStringOption(option => option.setName('music').setDescription('name of the song').setRequired(true))
    .addStringOption(option => option.setName('link').setDescription('link to the song')))
  .addSubcommand(subcommand => subcommand.setName('movies').setDescription('update your favorite movies')
    .addStringOption(option => option.setName('movie').setDescription('the name of the movies').setRequired(true))
    .addStringOption(option => option.setName('link').setDescription('link to the movie synopsis')))
  .addSubcommand(subcommand => subcommand.setName('shows').setDescription('update your favorite shows')
    .addStringOption(option => option.setName('show').setDescription('the name of the show').setRequired(true))
    .addStringOption(option => option.setName('link').setDescription('link to the show synopsis')))
  .addSubcommand(subcommand => subcommand.setName('foods').setDescription('update your favorite foods')
    .addStringOption(option => option.setName('food').setDescription('the name of the food').setRequired(true))
    .addStringOption(option => option.setName('link').setDescription('link to the food description')))
  .addSubcommand(subcommand => subcommand.setName('books').setDescription('update your favorite foods')
    .addStringOption(option => option.setName('book').setDescription('the name of the book').setRequired(true))
    .addStringOption(option => option.setName('link').setDescription('link to the book description'))),
  async execute(interaction, conn) {
    await interaction.deferReply();
    const { User } = conn.models;
    const property = interaction.options._subcommand;
    const user = await User.findOne({ discordId: interaction.user.id });
    let field = '';
    if (property == 'music') {
      field = interaction.options.getString('music');
    } else {
      field = interaction.options.getString(property.substring(0, property.length - 1));
    }
    const link = interaction.options.getString('link');
    const remove = user.favorites[property].find(x => x.name == field);
    if (remove) {
      user.favorites[property].pull({ _id: remove._id });
    } else {
      user.favorites[property].push({ name: field, url: link });
    }
    await user.save();
    await interaction.followUp('Favorites Updated!');
    
  }
}