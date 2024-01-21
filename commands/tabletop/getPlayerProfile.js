const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder().setName('getplayerprofile').setDescription('get a user\'s profile.')
  .addUserOption(option => option.setName('target').setDescription('the person\'s profile you wish to see.').setRequired(true)),
  async execute(interaction, conn) {
    await interaction.deferReply();

    const { GameProfile } = conn.models;
    const target = interaction.options.getUser('target');

    const user = await GameProfile.findOne({ player: target.id });
    const embed = new EmbedBuilder().setTitle(`${target.username}'s TableTop Profile`);
    embed.addFields({ name: 'Overall Player Level', value: user.overallPlayerLevel });
    embed.addFields({ name: 'Total Player Characters', value: user.numPlayerCharacters });
    embed.addFields({ name: 'Number of campaigns participated as player', value: user.numCampaigns });
    embed.addFields({ name: 'Number of campaigns as DM', value: user.numDmCampaigns });
    embed.setThumbnail(target.avatar);
    await interaction.followUp({ embeds: [embed], ephemeral: true });
  }
}