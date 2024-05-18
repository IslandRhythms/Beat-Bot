const { SlashCommandBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');
const TableRenderer = require('table-renderer');
const { saveImage } = TableRenderer;
const { parse } = require('csv-parse/sync');
const fetch = require('node-fetch');


module.exports = {
  data: new SlashCommandBuilder().setName('table')
  .setDescription('builds a table from the provided data. Keep entries small, or they will be shrunk.')
  .addStringOption(option => option.setName('title').setDescription('the title of your table').setRequired(true))
  .addStringOption(option => option.setName('headers').setDescription('a comma separated list (CSL) of headers for each column'))
  .addStringOption(option => option.setName('data').setDescription('a (CSL) of data to populate the table. include - to indicate a line separator for the row.'))
  .addStringOption(option => option.setName('background').setDescription('The hex color for the background. Default is #C0C0C0, white is #FFFFFF'))
  .addStringOption(option => option.setName('note').setDescription('Notes to leave on the message with the picture of the table'))
  .addAttachmentOption(option => option.setName('file').setDescription('A csv file instead of typing in the table.'))
  .addBooleanOption(option => option.setName('axe').setDescription('Set to true to prevent overflow, so 1,2,3,4,5,- with 3 columns ignores 4 and 5. Defaut is false')),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const background = interaction.options.getString('background') ?? '#C0C0C0';
    if (!background.startsWith('#')) {
      return interaction.followUp({ content: 'That is not a valid hex color', ephemeral: true });
    }
    const renderTable = TableRenderer.default({ backgroundColor: background }).render
    const title = interaction.options.getString('title');
    const headers = interaction.options.getString('headers') ?? '';
    const data = interaction.options.getString('data') ?? '';
    const axe = interaction.options.getBoolean('axe') ?? false;
    const note = interaction.options.getString('note') ?? '';
    let input = interaction.options.getAttachment('file') ?? '';
    let csvData = '';
    if (input && (headers || data)) {
      return interaction.followUp({ content: 'Either enter a file, or enter the data manually. Do not do both', ephemeral: true });
    }
    if (input) {
      input = interaction.options.getAttachment('file');
      if (!input.name.endsWith('.csv')) return interaction.followUp({ content: 'You must give it a csv', ephemeral: true });
      input = await fetch(input.url).then(res => res.text());
      csvData = parse(input);
    }
    const columns = [];
   
    const rows = ['-'];
    let stripped = headers.replace(/\s*,\s*/ig, ",");
    const headerArray = csvData.length ? csvData[0] : stripped.split(',');
    if (csvData.length) {
      csvData.shift(); // remove the headers
      csvData = csvData.flat(); // remove the nested arrays
    }
    const rowObject = {};
    for (let i = 0; i < headerArray.length; i++) {
      const obj = {};
      obj.width = 200;
      obj.title = headerArray[i];
      obj.dataIndex = headerArray[i].toLowerCase();
      rowObject[obj.dataIndex] = '';
      obj.align = 'left'; // center cuts off the first column's title, right botches the table completely
      columns.push(obj);
    }
    stripped = data.replace(/\s*,\s*/ig, ",");
    const dataArray = csvData.length ? csvData : stripped.split(',');
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
    
    return interaction.followUp({ content: note, files: [path.join(__dirname, 'table.png')]})
  }
}