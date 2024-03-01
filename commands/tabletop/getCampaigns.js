const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const getDiscordNameFromId = require('../../helpers/getDiscordNameFromId');


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
        embed.addFields({ name: 'GameMaster', value: getDiscordNameFromId(interaction.member.guild, res.gameMaster[i].discordId), inline: true });
      }
      
    }
    if (!embeds.length) {
      const embeds = [];
      const embed = new EmbedBuilder().setTitle('No entries found');
      embeds.push(embed);
      await interaction.followUp({ embeds, ephemeral: true });
    } else {
      await interaction.followUp({ embeds, ephemeral: true });
    }
    
  }
}