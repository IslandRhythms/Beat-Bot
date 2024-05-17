const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder().setName('riddle')
  .setDescription('Get a riddle'),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const url = 'https://riddles-api.vercel.app/random';
    const data = await axios.get(url).then(res => res.data);
    const embed = new EmbedBuilder().setTitle(`${data.riddle}`).setDescription(`|| ${data.answer} ||`).setFooter({ text: 'Possible thanks to https://riddles-api.vercel.app/' });
    await interaction.followUp({ embeds: [embed] });
  }
}