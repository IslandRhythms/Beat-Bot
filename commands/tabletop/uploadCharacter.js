const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs/promises');
const scraper = require('pdf-scraper');
const axios = require('axios');


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
    console.log(data.pages, data.pages.length);
    await interaction.followUp('Under Construction');
  }
}