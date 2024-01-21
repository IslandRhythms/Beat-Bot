const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder().setName('getfavorites').setDescription('get the indicated user\'s favorites.')
  .addUserOption(option => option.setName('user').setDescription('the user whose favorites you want to check out.').setRequired(true)),
  async execute(interaction, conn) {
    await interaction.deferReply();
    const { User } = conn.models;
    const target = interaction.options.getUser('user');
    const user = await User.findOne({ discordId: target.id });
    const categories = Object.keys(user.favorites);
    const embeds = [];
    for (let i = 0; i < categories.length; i++) {
      const embed = new EmbedBuilder();
      const category = categories[i];
      embed.setTitle(`${target.username}'s Favorite ${category}`);
      if (category == 'games' || category == 'music') {
        for (let pos = 0; pos < user.favorites[category].length; pos++) {
          embed.addFields({ name: `${user.favorites[category][pos].name}`, value: `${user.favorites[category][pos].url}` });
        }
      } else {
        for (let pos = 0; pos < user.favorites[category].length; pos++) {
          embed.addFields({ name: `${category}`, value: `${user.favorites[category][pos]}` });
        }
      }
      embeds.push(embed);
    }
    await interaction.followUp({ embeds }); 
  }
}