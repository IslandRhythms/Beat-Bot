const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder().setName('createcampaign').setDescription('create your campaign')
  .addStringOption(option => option.setName('campaign').setDescription('the name of your campaign.').setRequired(true))
  .addStringOption(option => option.setName('system').setDescription('what system is your game using?').setRequired(true))
  .addStringOption(option => option.setName('description').setDescription('what is the gist of your campaign?').setRequired(true))
  .addRoleOption(option => option.setName('players').setDescription('what role that all your players should have.').setRequired(true))
  .addUserOption(option => option.setName('dm').setDescription('who is the dm for the campaign?').setRequired(true).setRequired(true)),
  async execute(interaction, conn) {
    await interaction.deferReply();

    const { Campaign, User } = conn.models;
    const dm = interaction.options.getUser('dm');
    const players = interaction.options.getRole('players');
    const description = interaction.options.getString('description');
    const system = interaction.options.getString('system');
    const adventure = interaction.options.getString('campaign');
    const playerArray = [];
    players.members.map(x => playerArray.push(x.user.id));
    const users = await User.find({ discordId: { $in: playerArray }});
    const playerIds = []
    users.map(x => playerIds.push(x._id));
    const GM = await User.findOne({ discordId: dm.id });
    // await Campaign.create({ title: adventure, system, description, gameMaster: [dm], players: playerIds });
    return interaction.followUp('Under Construction');
    const embed = new EmbedBuilder().setTitle().setThumbnail();
    await interaction.followUp({ embeds: [embed], ephemeral: true });
  }
}