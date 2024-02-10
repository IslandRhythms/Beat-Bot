const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs/promises');
const parseRollTwentySheet = require('../../helpers/parseRollTwentySheet');
const parseHtmlPage = require('../../helpers/parseHtmlPage');

module.exports = {
  data: new SlashCommandBuilder().setName('uploadcharacter').setDescription('upload one of your characters')
  .addAttachmentOption(option => option.setName('sheet').setDescription('The character\'s sheet').setRequired(true))
  .addStringOption(option => option.setName('source').setDescription('where was this file generated from?').addChoices(
    { name: 'Roll20', value: 'Roll20'},
    { name: 'html from command', value: 'html'}
  ).setRequired(true))
  .addStringOption(option => option.setName('campaignid').setDescription('what campaign is your character a participant?').setRequired(true))
  .addStringOption(option => option.setName('groupname').setDescription('what is the name of their adventuring group?').setRequired(true)) // could have a character without a group name yet
  .addStringOption(option => option.setName('system').setDescription('what system was your character played in?').addChoices(
    { name: 'Dungeons and Dragons', value: 'D&D' },
    { name: 'Pathfinder', value: 'Pathfinder' }
  ).setRequired(true))
  .addBooleanOption(option => option.setName('alive').setDescription('Did you character survive their campaign?').setRequired(true))
  .addAttachmentOption(option => option.setName('picture').setDescription('a picture of your character'))
  .addStringOption(option => option.setName('backstory').setDescription('what was your character\'s past before they became an adventurer.'))
  .addStringOption(option => option.setName('epilogue').setDescription('what happened to your character after the adventure?')),
  async execute(interaction, conn) {
    await interaction.deferReply();
    const { GameProfile, User, Character, Campaign } = conn.models;
    const sheet = interaction.options.getAttachment('sheet');
    const source = interaction.options.getString('source');
    const user = await User.findOne({ discordId: interaction.user.id });
    const gameProfile = await GameProfile.findOne({ player: user._id });
    console.log('what is sheet', sheet); // make sure to delete sheet after the command finishes
    let obj = null;
    if (source == 'Roll20' && sheet.contentType == 'application/pdf') {
      obj = await parseRollTwentySheet(sheet);
      // do additional parsing here for class and level
    } else if (source == 'html' && sheet.contentType.includes('text/html')) {
      obj = await parseHtmlPage(sheet);
    } else {
      return interaction.followUp('Please ensure the uploaded file type is one that this command supports.')
    }
    const campaignId = interaction.options.getString('campaignid');
    const campaign = await Campaign.findOne({ $or: [{ _id: campaignId }, { campaignId: campaignId }]});
    obj.epilogue = interaction.options.getString('epilogue');
    obj.isAlive = interaction.options.getBoolean('alive');
    if (source == 'Roll20') {
      obj.backStory = interaction.options.getString('backstory');
    }
    if (interaction.options.getString('picture')) {
      obj.characterImage = interaction.options.getString('picture').url;
    }
    obj.groupName = interaction.options.getString('groupname');
    obj.player = user._id;
    obj.playerProfile = gameProfile._id;
    obj.campaign = campaign._id;
    obj.system = interaction.options.getString('system');
    const numCharacters = await Character.countDocuments();
    obj.characterId = `${obj.name}-${numCharacters + 1}`;
    const character = await Character.create(...obj);
    gameProfile.playerCharacters.push(character._id)
    // delete downloaded sheet
    // sent back an embed showing what the uploaded information looks like

    await interaction.followUp('Under Construction');
  }
}