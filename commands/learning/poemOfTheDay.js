
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

// https://discord.js.org/#/docs/builders/main/class/SlashCommandBuilder?scrollTo=addMentionableOption

module.exports = {
  data: new SlashCommandBuilder().setName('poem')
  .setDescription('Get more information on the poem of the day.'),
  async execute(interaction, conn) {
    const { Daily } = conn.models;
    await interaction.deferReply({ ephemeral: true });
    const doc = await Daily.findOne().sort({ createdAt: -1 });
    const res = await axios.get(`https://poetrydb.org/title,author/${doc.poemOTD.title};${doc.poemOTD.author}`).then(res => res.data);
    const poem = res[0];
    const embed = new EmbedBuilder()
    .setTitle(`${poem.title}`)
    .setAuthor({ name: `${poem.author}`})
    .setDescription(`${poem.lines.join('\n')}`)
    await interaction.followUp({ embeds: [embed] })
  }
}