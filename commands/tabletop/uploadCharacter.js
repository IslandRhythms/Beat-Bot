const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs/promises');
const scraper = require('pdf-scraper');
const axios = require('axios');
const indexOfEnd = require('../../helpers/indexOfEnd');

module.exports = {
  data: new SlashCommandBuilder().setName('uploadcharacter').setDescription('upload one of your characters')
  .addAttachmentOption(option => option.setName('sheet').setDescription('The character\'s sheet').setRequired(true))
  .addStringOption(option => option.setName('source').setDescription('where was this pdf generated from?').addChoices(
    { name: 'Roll20', value: 'Roll20'}
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
    const { GameProfile } = conn.models;
    const sheet = interaction.options.getAttachment('sheet');
    console.log('what is sheet', sheet);
    const res = await axios.get(sheet.url, { responseType: 'arraybuffer'});
    const fileData = Buffer.from(res.data, 'binary');
    await fs.writeFile(`./${sheet.name}`, fileData);
    const data = await scraper(await fs.readFile(`./${sheet.name}`));
    console.log(data.pages, data.pages.length, data.pages[0]);
    const text = data.pages[0];
    const nameHeader = text.indexOf('CHARACTER NAME');
    const nameEnd = indexOfEnd(text, 'CHARACTER NAME');
    const name = text.substring(0, nameHeader).trim();
    const classHeader = text.indexOf('CLASS & LEVEL');
    const classAndLevelArray = text.substring(nameEnd, classHeader).replace(/\n/g, '').trim().split(',');
    const classAndLevelEnd = indexOfEnd(text, 'CLASS & LEVEL');
    const backgroundHeader = text.indexOf('BACKGROUNDPLAYER NAME');
    const background = text.substring(classAndLevelEnd, backgroundHeader);
    const raceHeader = text.indexOf('RACE');
    const backgroundEnd = indexOfEnd(text, 'BACKGROUNDPLAYER NAME');
    const race = text.substring(backgroundEnd, raceHeader);
    const alignmentHeader = text.indexOf('ALIGNMENT');
    const raceEnd = indexOfEnd(text, 'RACE');
    const alignment = text.substring(raceEnd, alignmentHeader);
    const xpHeader = text.indexOf('EXPERIENCE POINTS');
    const alignmentEnd = indexOfEnd(text, 'ALIGNMENT');
    const xp = text.substring(alignmentEnd, xpHeader);
    const strength = text.indexOf('STRENGTH');
    const dexterity = text.indexOf('DEXTERITY');
    const constitution = text.indexOf('CONSTITUTION');
    const intelligence = text.indexOf('INTELLIGENCE');
    const wisdom = text.indexOf('WISDOM');
    const charisma = text.indexOf('CHARISMA');
    await interaction.followUp('Under Construction');
  }
}