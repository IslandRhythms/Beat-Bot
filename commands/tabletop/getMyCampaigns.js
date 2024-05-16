const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const getDiscordNameFromId = require('../../helpers/getDiscordNameFromId');
const { Pagination } = require('pagination.djs');


module.exports = {
  data: new SlashCommandBuilder().setName('getmycampaign').setDescription('get the details of a campaign you\'re in.')
  .addStringOption(option => option.setName('title').setDescription('the name of the campaign you are in. Omit to get all.'))
  .addStringOption(option => option.setName('id').setDescription('the id of the campaign')),
  async execute(interaction, conn) {
    const pagination = new Pagination(interaction);
    await interaction.deferReply({ ephemeral: true });
    const { Campaign, User } = conn.models;
    const obj = {};
    const title = interaction.options.getString('title');
    const campaignId = interaction.options.getString('id');
    const user = interaction.user.id;
    const member = await User.findOne({ discordId: user })
    obj.$or = [{ gameMaster: member._id }, { players: member._id }];
    if (title) {
      obj.title = title;
    }
    if (id) {
      obj.campaignId = campaignId;
    }
    const res = await Campaign.find(obj).populate('gameMaster').populate('players').populate('characters');
    const embeds = [];
    for (let i = 0; i < res.length; i++) {
      const campaign = res[i];
      const embed = new EmbedBuilder().setTitle(`${campaign.title}`).setDescription(campaign.description).setThumbnail(campaign.groupLogo);
      embed.addFields({ name: 'System', value: campaign.system });
      for (let j = 0; j < campaign.gameMaster.length; j++) {
        embed.addFields({ name: 'GM', value: getDiscordNameFromId(interaction.member.guild, campaign.gameMaster[i].discordId), inline: true });
      }
      for (let index = 0; index < campaign.players.length; index++) {
        // do both player and character
        const player = campaign.players[i];
        const character = campaign.characters.find(x => x.player.toString() == player.toString() && (x.isAlive && !x.isRetired));
        embed.addFields({ name: 'Player', value: getDiscordNameFromId(interaction.member.guild, player.discordId), inline: true });
        embed.addFields({ name: 'Character', value: character.name, inline: true });
        // be sure to check that the associated character with the campaign is not dead or retired but is active in the campaign.
      }
      embeds.push(embed);
    }
    if (!embeds.length) {
      const embeds = [];
      const embed = new EmbedBuilder().setTitle('No entries found');
      embeds.push(embed);
      await interaction.followUp({ embeds});
    } else {
      pagination.setEmbeds(embeds, (embed, index, array) => {
        return embed.setFooter({ text: `Page: ${index + 1}/${array.length}` });
      });
      return pagination.render();
    }
  }
}