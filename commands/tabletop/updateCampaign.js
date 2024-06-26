const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const downloadFile = require('../../helpers/downloadFile');
const uploadFileToGoogle = require('../../helpers/uploadFileToGoogle');
const fs = require('fs');


module.exports = {
  data: new SlashCommandBuilder().setName('updatecampaign').setDescription('update details of a campaign you\'re in.')
  .addStringOption(option => option.setName('campaignid').setDescription('the id of the campaign you wish to update.').setRequired(true))
  .addStringOption(option => option.setName('title').setDescription('the new name of the campaign.'))
  .addStringOption(option => option.setName('meeting').setDescription('the meeting time and day'))
  .addStringOption(option => option.setName('groupname').setDescription('the new name of the adventuring group.'))
  .addBooleanOption(option => option.setName('victory').setDescription('did the players win?'))
  .addBooleanOption(option => option.setName('stale').setDescription('did the campaign become statle?'))
  .addAttachmentOption(option => option.setName('grouplogo').setDescription('the new logo of the adventuring group.'))
  .addUserOption(option => option.setName('player').setDescription('the player you wish to add or remove from the campaign.'))
  .addStringOption(option => option.setName('character').setDescription('the name of the character you wish to add or remove. Must include with player option.')) // this is more nuanced
  .addUserOption(option => option.setName('gm').setDescription('the game master you wish to add or remove from the campaign.')),
  async execute(interaction, conn) {
    await interaction.deferReply({ ephemeral: true });
    const { Campaign, Character, User } = conn.models;
    const campaignId = interaction.options.getString('campaignid');
    const title = interaction.options.getString('title');
    const groupName = interaction.options.getString('groupname');
    const attachment = interaction.options.getAttachment('grouplogo');
    const groupLogo = attachment;
    const character = interaction.options.getString('character');
    const GM = interaction.options.getUser('gm');
    const player = interaction.options.getUser('player');
    const meeting = interaction.options.getString('meeting');
    const victory = interaction.options.getBoolean('victory');
    const stale = interaction.options.getBoolean('stale');

    const campaign = await Campaign.findOne({ campaignId, guildId: interaction.guildId }).populate('gameMaster');

    let user = '';
    let userCharacter = '';
    let gms = campaign.gameMaster.map(x => x.discordId);
    const isGM = gms.includes(interaction.user.id);

    if ((player && !character) || (!player && character)) {
      return interaction.followUp('You must include both the player and character when updating the campaign with that information.')
    }
    if (GM) {
      if (GM.id != interaction.user.id && gms.includes(GM.id)) {
        return interaction.followUp(`Only a GM can remove themself from a campaign.`)
      }
      if (isGM && !gms.includes(GM.id)) {
        // add to Gm array
        const gmUser = await User.findOne({ discordId: GM.id });
        campaign.gameMaster.push(gmUser._id);

      }
    }
    
    if (player) {
      if (player.id != interaction.user.id && !gms.includes(interaction.user.id)) {
        return interaction.followUp(`You cannot remove another player from a campaign unless you are a gm.`)
      }
      user = await User.findOne({ discordId: player.id });
      userCharacter = await Character.findOne({ player: user._id, name: character });
      if (!userCharacter) {
        return interaction.followUp(`No character found with that name for player ${interaction.user.username}`)
      }
      if (campaign.players.includes(user._id)) {
         // remove player
        campaign.players.pull(user._id);
      } else {
        // add player
        campaign.players.push(user._id);
      }
      if (campaign.characters.find(x => x._id.toString() == userCharacter._id.toString())) {
        campaign.characters.pull(userCharacter._id)
      } else {
        campaign.characters.push(userCharacter._id)
      }
    }


    if (title) {
      campaign.title = title;
    }
    if (groupName) {
      campaign.groupName = groupName;
    }
    if (groupLogo) {
      await downloadFile(groupLogo.url, `./groupLogo`);
      const links = await uploadFileToGoogle(`groupLogo`, `./groupLogo`, groupLogo.contentType)
      campaign.groupLogo = links.webContentLink;
      fs.unlinkSync(`./groupLogo`)
    }
    if (victory) {
      campaign.isVictory = victory;
    }
    if (stale) {
      campaign.isStale = stale;
    }
    if (meeting) {
      campaign.meetingAt = meeting;
    }
    await campaign.save();
    await interaction.followUp('Campaign Updated!');
  }
}