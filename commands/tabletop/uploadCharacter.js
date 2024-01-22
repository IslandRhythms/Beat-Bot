const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs/promises');
const scraper = require('pdf-scraper');
const axios = require('axios');


module.exports = {
  data: new SlashCommandBuilder().setName('uploadcharacter').setDescription('upload one of your characters')
  .addAttachmentOption(option => option.setName('sheet').setDescription('The character\'s sheet').setRequired(true))
  .addStringOption(option => option.setName('source').setDescription('where was this pdf generated from?').addChoices(
    { name: 'Roll20', value: 'Roll20'}
  ).setRequired(true)),
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