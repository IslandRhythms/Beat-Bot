
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

// https://discord.js.org/#/docs/builders/main/class/SlashCommandBuilder?scrollTo=addMentionableOption

module.exports = {
  data: new SlashCommandBuilder().setName('book')
  .setDescription('Get more information on the book of the day.'),
  async execute(interaction, conn) {
    const { Daily } = conn.models;
    await interaction.deferReply();
    const doc = await Daily.findOne().sort({ createdAt: -1 });
    const url = `https://openlibrary.org${doc.bookOTD.bookRoute}`
    await axios.get(url).then(res => res.data);
    const embed = new EmbedBuilder();
    await interaction.followUp({ embeds: [embed] })
  }
}