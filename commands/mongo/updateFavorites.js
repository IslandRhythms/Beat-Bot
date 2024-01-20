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
    const property = interaction.options._subcommand;
    const user = await User.findOne({ discordId: interaction.user.id });
    if (property == 'games') {
      const game = interaction.options.getString('game');
      const link = interaction.options.getString('link');
      const remove = user.favorites[property].find(x => x.name == game);
      console.log('what is remove', remove);
      if (remove) {
        user.favorites[property].pull({ _id: remove._id });
      } else {
        user.favorites[property].push({ name: game, url: link });
      }
    } else if (property == 'music') {
      const music = interaction.options.getString('music');
      const link = interaction.options.getString('link');
      const remove = user.favorites[property].find(x => x.name == music);
      if (remove) {
        user.favorites[property].pull({ _id: remove._id });
      } else {
        user.favoirtes[property].push({ name: music, url: link });
      }
    } else {
      const entry = interaction.options.getString(property.substring(0, property.length - 1 ));
      const remove = user.favorites[property].find(x => x == entry);
      if (remove) {
        user.favorites[property].pull(entry);
      } else {
        user.favorites[property].push(entry);
      }
    }
    await user.save();
    await interaction.followUp('Favorites Updated!');
    
  }
}