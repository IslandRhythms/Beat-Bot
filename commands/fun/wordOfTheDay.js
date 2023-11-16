const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const parser = require('node-html-parser');

module.exports = {
  data: new SlashCommandBuilder().setName('wordoftheday').setDescription('Gets the word of the day from dictionary.com'),
  async execute(interaction) {
    await interaction.deferReply();
    const res = await axios.get('https://www.dictionary.com/e/word-of-the-day/').then(res => res.data);
    const root = parser.parse(res);
    const element = root.querySelector('div.wotd-item div.otd-item-headword__word h1');
    const word = element.textContent;
    const page = await axios.get(`https://www.dictionary.com/browse/${word}`).then(res => res.data);
    const content = parser.parse(page);
    content.querySelector('div.luna-definition-card')
    console.log('what is content', content.textContent); // doesn't work
    const embed = [];
    const WOTD = new EmbedBuilder();
    await interaction.followUp(`Under Construction`)
  }
}