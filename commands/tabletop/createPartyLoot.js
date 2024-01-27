const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder().setName('createpartyloot').setDescription('log newly looted items in the party inventory')
  .addStringOption(option => option.setName('campaign').setDescription('the name of your campaign.').setRequired(true))
  .addStringOption(option => option.setName('name').setDescription('the name of the new item').setRequired(true))
  .addStringOption(option => option.setName('url').setDescription('the link to the item')),
  async execute(interaction, conn) {
    await interaction.deferReply();

    const { Campaign } = conn.models;
    const adventure = interaction.options.getString('campaign');
    const item = interaction.options.getString('name');
    const url = interaction.options.getString('url');
    const userId = interaction.user.id;
    const doc = await Campaign.findOne({ title: adventure, $or: [{ players: userId }, { gameMaster: userId }] });
    if (!doc) {
      return interaction.followUp(`No campaign found meeting the indicated parameters.`);
    }
    doc.partyLoot.push({ name: item, url });
    await doc.save();
    await interaction.followUp({ content: 'Party Loot Updated!', ephemeral: true });
  }
}