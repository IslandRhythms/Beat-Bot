const { SlashCommandBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');
const TableRenderer = require('table-renderer');
const { saveImage } = TableRenderer;


module.exports = {
  data: new SlashCommandBuilder().setName('table')
  .setDescription('builds a table from the provided data')
  .addStringOption(option => option.setName('title').setDescription('the title of your table').setRequired(true))
  .addStringOption(option => option.setName('headers').setDescription('a comma separated list (CSL) of headers for each column').setRequired(true))
  .addStringOption(option => option.setName('data').setDescription('a (CSL) of data to populate the table with. include - to indicate a line separator for the row').setRequired(true))
  .addStringOption(option => option.setName('background').setDescription('The hex color for the background. Default is charcoal, white is #FFFFFF'))
  .addBooleanOption(option => option.setName('axe').setDescription('Set to true to prevent overflow, so 1,2,3,4,5,- with 3 columns ignores 4 and 5. Defaut is false')),
  async execute(interaction) {
    await interaction.deferReply();
    const background = interaction.options.getString('background') ?? '#36454F';
    if (!background.startsWith('#')) {
      return interaction.followUp({ content: 'That is not a valid hex color', ephemeral: true });
    }
    const renderTable = TableRenderer.default({ backgroundColor: background }).render
    const title = interaction.options.getString('title');
    const headers = interaction.options.getString('headers');
    const axe = interaction.options.getBoolean('axe') ?? false;
    let stripped = headers.replace(/\s*,\s*/ig, ",");
    const headerArray = stripped.split(',');
    const columns = [];
    const rowObject = {};
    for (let i = 0; i < headerArray.length; i++) {
      const obj = {};
      obj.width = 200;
      obj.title = headerArray[i];
      obj.dataIndex = headerArray[i].toLowerCase();
      rowObject[obj.dataIndex] = '';
      obj.align = 'center';
      columns.push(obj);
    }
    const data = interaction.options.getString('data');
    stripped = data.replace(/\s*,\s*/ig, ",");
    const dataArray = stripped.split(',');
    const rows = ['-'];
    const keys = Object.keys(rowObject);
    let j = 0;
    let obj = {};
    for (let i = 0; i < dataArray.length; i++) {
      if (dataArray[i] == '-') {
        rows.push(dataArray[i]);
        if (axe) {
          j = 0;
        }
      } else {
        if (j == keys.length) {
          rows.push(obj);
          obj = {};
          j = 0;
        }
        obj[keys[j]] = dataArray[i];
        j++;
      }
    }
    if (Object.keys(obj).length) {
      rows.push(obj);
    }
    const canvas = renderTable({
      title: title,
      columns: columns,
      dataSource: rows
    });
    await saveImage(canvas, path.join(__dirname, 'table.png'));
    
    return interaction.followUp({ files: [path.join(__dirname, 'table.png')]})
  }
}