const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder().setName('updatepartyloot').setDescription('update party loot')
  .addStringOption(option => option.setName('item').setDescription('the name of the item').setRequired(true))
  .addBooleanOption(option => option.setName('used').setDescription('is the item currently being used by a party member?').setRequired(true))
  .addUserOption(option => option.setName('player').setDescription('the player that is currently using the checked out item.'))
  .addStringOption(option => option.setName('link').setDescription('a link or reference to the item')),
  async execute(interaction, conn) {
    await interaction.deferReply();

    const { Campaign } = conn.models;
    await interaction.followUp('Under Construction');
  }
}