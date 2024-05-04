
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

// https://discord.js.org/#/docs/builders/main/class/SlashCommandBuilder?scrollTo=addMentionableOption

module.exports = {
  data: new SlashCommandBuilder().setName('book')
  .setDescription('Get more information on the book of the day.'),
  async execute(interaction, conn) {
    const { Daily } = conn.models;
    await interaction.deferReply({ ephemeral: true });
    const doc = await Daily.findOne().sort({ createdAt: -1 });
    const url = `https://openlibrary.org${doc.bookOTD.bookRoute}`
    const data = await axios.get(url).then(res => res.data);
    const bookIdParts = doc.bookOTD.bookRoute.split('/');
    const bookId = bookIdParts[bookIdParts.length - 1];
    const embed = new EmbedBuilder()
      .setTitle(data.title)
      .setImage(`https://covers.openlibrary.org/b/olid/${bookId}-M.jpg`);
    if (data.description) {
      embed.setDescription(data.description.value)
    }
    for (let i = 0; i < data.subjects.length; i++) {
      embed.addFields({ name: 'Subject', value: data.subjects[i], inline: true })
    }
    await interaction.followUp({ embeds: [embed] })
  }
}