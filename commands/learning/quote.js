const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const wikipedia = require('wikipedia');

module.exports = {
  data: new SlashCommandBuilder().setName('quote')
  .setDescription('get a quote from a famous author.')
  .addStringOption(option => option.setName('author').setDescription('specify what author you want the quote to originate from.')),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const author = interaction.options.getString('author');
    const embed = new EmbedBuilder();
    let obj = null;
    if (author) {
      const res = await axios.get(`https://api.fisenko.net/v1/authors/en?query=${encodeURIComponent(author)}`).then(res => res.data);
      const authorDoc = res.find(x => x.name.toLowerCase() == author.toLowerCase());
      if (authorDoc) {
        const ping = await axios.get(`https://api.fisenko.net/v1/authors/en/${authorDoc.id}/quotes`).then(res => res.data);
        obj = ping[Math.floor(Math.random() * ping.length)];
      } else {
        await interaction.followUp('author could not be found.')
      }
    } else {
      const res = await axios.get(`https://api.fisenko.net/v1/quotes/en/random`).then(res => res.data);
      obj = res;
    }
    const page = await wikipedia.page(obj.author.name);
    const summary = await page.summary();
    embed.setTitle(obj.author.name ?? `Could not get author name`);
    embed.setDescription(obj.text ?? `Could not get poem`);
    embed.setImage(summary.thumbnail ? summary.thumbnail.source : 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Wikipedia-logo-v2-en.svg/1200px-Wikipedia-logo-v2-en.svg.png');
    embed.setFooter({ text: 'Possible thanks to https://github.com/fisenkodv for creating https://github.com/fisenkodv/dictum api and wikipedia https://www.npmjs.com/package/wikipedia.' });
    await interaction.followUp({ embeds: [embed] });
  }
}