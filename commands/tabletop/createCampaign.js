const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder().setName('createcampaign').setDescription('create your campaign')
  .addStringOption(option => option.setName('campaign').setDescription('the name of your campaign.').setRequired(true))
  .addStringOption(option => option.setName('system').setDescription('what system is your game using?').setRequired(true))
  .addStringOption(option => option.setName('description').setDescription('what is the gist of your campaign?').setRequired(true))
  .addStringOption(option => option.setName('meeting').setDescription('what time and day everyone meets to play').setRequired(true))
  .addRoleOption(option => option.setName('players').setDescription('what role that all your players should have.').setRequired(true))
  .addUserOption(option => option.setName('dm').setDescription('who is the dm for the campaign?').setRequired(true).setRequired(true)),
  async execute(interaction, conn) {
    await interaction.deferReply();
    const { Campaign, User } = conn.models;
    const guildId = interaction.guildId;
    const dm = interaction.options.getUser('dm');
    const players = interaction.options.getRole('players');
    const description = interaction.options.getString('description');
    const system = interaction.options.getString('system');
    const adventure = interaction.options.getString('campaign');
    const meeting = interaction.options.getString('meeting');
    const playerArray = [];
    players.members.map(x => playerArray.push(x.user.id));
    const users = await User.find({ discordId: { $in: playerArray }});
    const playerIds = []
    users.map(x => playerIds.push(x._id));
    const GM = await User.findOne({ discordId: dm.id });
    const numCampaigns = await Campaign.countDocuments();
    const campaignId = adventure + numCampaigns;
    await Campaign.create({ title: adventure, system, description, gameMaster: [GM._id], players: playerIds, guildId, campaignId: campaignId, meetingAt: meeting });
    const embed = new EmbedBuilder().setTitle(`${adventure}`).setDescription(description);
    embed.addFields({ name: 'System', value: system, inline: true });
    embed.addFields({ name: 'GM', value: dm.username, inline: true });
    embed.addFields({ name: 'CampaignId', value: campaignId, inline: true });
    for (let i = 0; i < players.members.length; i++) {
      embed.addFields({ name: 'Player', value: players.members[i].username, inline: true });
    }
    await interaction.followUp({ embeds: [embed], ephemeral: true });
  }
}