const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');


module.exports = {
  data: new SlashCommandBuilder().setName('smart').setDescription('bot gives you a phrase that will make you sound smart.'),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const res = await axios.get('https://techy-api.vercel.app/api/json').then(res => res.data);
    await interaction.followUp(res.message);
  }
}