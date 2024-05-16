const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const getDiscordNameFromId = require('../../helpers/getDiscordNameFromId');
const { Pagination } = require('pagination.djs');


module.exports = {
  data: new SlashCommandBuilder().setName('getcampaigns').setDescription('get the details of all active campaigns on the server.')
  .addStringOption(option => option.setName('system').setDescription('the system the campaign is using.')),
  async execute(interaction, conn) {
    const pagination = new Pagination(interaction);
    await interaction.deferReply({ ephemeral: true });
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
      await interaction.followUp({ embeds });
    } else {
      pagination.setEmbeds(embeds, (embed, index, array) => {
        return embed.setFooter({ text: `Page: ${index + 1}/${array.length}` });
      });
      return pagination.render();
    }
    
  }
}