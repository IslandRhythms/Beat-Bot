const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs/promises');
const scraper = require('pdf-scraper');
const axios = require('axios');
const indexOfEnd = require('../../helpers/indexOfEnd');
const parseRollTwentySheet = require('../../helpers/parseRollTwentySheet');
const parseHtmlPage = require('../../helpers/parseHtmlPage');

module.exports = {
  data: new SlashCommandBuilder().setName('uploadcharacter').setDescription('upload one of your characters')
  .addAttachmentOption(option => option.setName('sheet').setDescription('The character\'s sheet').setRequired(true))
  .addStringOption(option => option.setName('source').setDescription('where was this file generated from?').addChoices(
    { name: 'Roll20', value: 'Roll20'},
    { name: 'html from command', value: 'html'}
  ).setRequired(true))
  .addStringOption(option => option.setName('backstory').setDescription('what was your character\'s past before they became an adventurer.').setRequired(true))
  .addStringOption(option => option.setName('campaign').setDescription('what campaign is your character a participant?').setRequired(true))
  .addStringOption(option => option.setName('groupname').setDescription('what is the name of their adventuring group?').setRequired(true))
  .addStringOption(option => option.setName('system').setDescription('what system was your character played in?').addChoices(
    { name: 'Dungeons and Dragons', value: 'D&D' },
    { name: 'Pathfinder', value: 'Pathfinder' }
  ).setRequired(true))
  .addBooleanOption(option => option.setName('alive').setDescription('Did you character survive their campaign?').setRequired(true))
  .addAttachmentOption(option => option.setName('picture').setDescription('a picture of your character'))
  .addStringOption(option => option.setName('epilogue').setDescription('what happened to your character after the adventure?')),
  async execute(interaction, conn) {
    await interaction.deferReply();
    const { GameProfile, User } = conn.models;
    const sheet = interaction.options.getAttachment('sheet');
    const source = interaction.options.getString('source');
    const user = await User.findOne({ discordId: interaction.user.id });
    console.log('what is sheet', sheet); // make sure to delete sheet after the command finishes
    let obj = null;
    if (source == 'Roll20' && sheet.contentType == 'application/pdf') {
      obj = await parseRollTwentySheet(sheet);
    } else if (source == 'html' && sheet.contentType.includes('text/html')) {
      obj = await parseHtmlPage(sheet);
    } else {
      return interaction.followUp('Please ensure the uploaded file type is one that this command supports.')
    }
    obj.epilogue = interaction.options.getString('epilogue');
    obj.isAlive = interaction.options.getBoolean('alive');
    // create character
    // await GameProfile.create();
    // delete downloaded sheet

    await interaction.followUp('Under Construction');
  }
}