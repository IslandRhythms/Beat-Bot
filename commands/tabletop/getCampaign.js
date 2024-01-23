const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder().setName('getcampaign').setDescription('get the details of a campaign you\'re in.')
  .addStringOption(option => option.setName('title').setDescription('the name of the campaign you are in. Omit to get all.'))
  .addStringOption(option => option.setName('id').setDescription('the id of the campaign')),
  async execute(interaction, conn) {
    await interaction.deferReply();
    const { Campaign, User } = conn.models;
    const obj = {};
    const title = interaction.options.getString('title');
    const campaignId = interaction.options.getString('id');
    if (title) {
      obj.title = title;
    }
    if (id) {
      obj.campaignId = campaignId;
    }
    const res = await Campaign.find(obj).populate('gameMaster').populate('players').populate('characters');
    const embeds = [];
    for (let i = 0; i < res.length; i++) {
      const embed = new EmbedBuilder().setTitle(`${res.title}`).setDescription(res.description).setThumbnail(res.groupLogo);
      embed.addFields({ name: 'System', value: res.system });
      
    }
    return interaction.followUp('Under Construction');
    await interaction.followUp({ embeds, ephemeral: true });
  }
}