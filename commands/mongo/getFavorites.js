const { SlashCommandBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder().setName('getfavorites').setDescription('get the indicated user\'s favorites.')
  .addUserOption(option => option.setName('user').setDescription('the user whose favorites you want to check out.').setRequired(true)),
  async execute(interaction, conn) {
    await interaction.deferReply();
    const { User } = conn.models;
    const target = interaction.options.getUser('user');
    const user = await User.findOne({ discordId: target.id });
    
    await interaction.followUp(`${user.discordName}'s favorites are ${user.favorites}`);
    
  }
}