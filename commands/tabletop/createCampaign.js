const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder().setName('createcampaign').setDescription('create your campaign')
  .addStringOption(option => option.setName('campaign').setDescription('the name of your campaign.').setRequired(true))
  .addStringOption(option => option.setName('system').setDescription('what system is your game using?').setRequired(true))
  .addStringOption(option => option.setName('description').setDescription('what is the gist of your campaign')),
  async execute(interaction, conn) {
    await interaction.deferReply();

    const { Campaign } = conn.models;
    const embed = new EmbedBuilder().setTitle().setThumbnail();
    await interaction.followUp({ embeds: [embed], ephemeral: true });
  }
}