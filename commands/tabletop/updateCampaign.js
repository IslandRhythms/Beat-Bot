const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder().setName('updatecampaign').setDescription('update details of a campaign you\'re in.')
  .addStringOption(option => option.setName('campaignid').setDescription('the id of the campaign you wish to update.').setRequired(true))
  .addStringOption(option => option.setName('title').setDescription('the new name of the campaign.'))
  .addStringOption(option => option.setName('groupname').setDescription('the new name of the adventuring group.'))
  .addStringOption(option => option.setName('grouplogo').setDescription('the new logo of the adventuring group.'))
  .addUserOption(option => option.setName('player').setDescription('the player you wish to add or remove from the campaign.'))
  .addStringOption(option => option.setName('character').setDescription('the name of the character. Must include with player option.'))
  .addUserOption(option => option.setName('gm').setDescription('the game master you wish to add or remove from the campaign.')),
  async execute(interaction, conn) {
    await interaction.deferReply();
    const { Campaign } = conn.models;
    await interaction.followUp('Under Construction');
  }
}