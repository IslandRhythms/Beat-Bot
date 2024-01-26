const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder().setName('getcampaigns').setDescription('get the details of all active campaigns on the server.')
  .addStringOption(option => option.setName('system').setDescription('the system the campaign is using.')),
  async execute(interaction, conn) {
    await interaction.deferReply();
    const { Campaign } = conn.models;
    const system = interaction.options.getString('system');
    const obj = {};
    if (system) {
      obj.system = system;
    }
    const res = await Campaign.find(obj).populate('gameMaster');
    const embeds = [];
    for (let i = 0; i < res.length; i++) {
      const embed = new EmbedBuilder().setTitle(`${res.title}`).setDescription(res.description).setThumbnail(res.groupLogo);
      embed.addFields({ name: 'System', value: res.system });
      for (let j = 0; j < res.gameMaster.length; j++) {
        const user = interaction.members.find(x => x.id == res.gameMaster[i].discordId);
        embed.addFields({ name: 'GameMaster', value: user.username, inline: true });
      }
      
    }
    await interaction.followUp({ embeds, ephemeral: true });
  }
}