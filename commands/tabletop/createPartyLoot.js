const { SlashCommandBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder().setName('createpartyloot').setDescription('log newly looted items in the party inventory')
  .addStringOption(option => option.setName('campaign').setDescription('the name of your campaign.').setRequired(true))
  .addStringOption(option => option.setName('name').setDescription('the name of the new item').setRequired(true))
  .addStringOption(option => option.setName('url').setDescription('the link to the item')),
  async execute(interaction, conn) {
    await interaction.deferReply();

    const { Campaign, User } = conn.models;
    const adventure = interaction.options.getString('campaign');
    const item = interaction.options.getString('name');
    const url = interaction.options.getString('url');
    const user = await User.findOne({ discordId: interaction.user.id });
    if (!user) {
      return interaction.followUp('You do not exist in the db, please contact Beat.');
    }
    const userId = user._id;
    const doc = await Campaign.findOne({ title: adventure, $or: [{ players: userId }, { gameMaster: userId }] });
    if (!doc) {
      return interaction.followUp(`No campaign found meeting the indicated parameters.`);
    }
    doc.partyLoot.push({ name: item, url });
    await doc.save();
    await interaction.followUp({ content: 'Party Loot Created!', ephemeral: true });
  }
}