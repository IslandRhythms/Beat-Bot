const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

// consider only allowing the bot to run this command.
module.exports = {
  cooldown: 60,
  data: new SlashCommandBuilder().setName('fact').setDescription('gets a random interesting fact.'),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const res = await axios.get('https://uselessfacts.jsph.pl/api/v2/facts/random').then(res => res.data);
    await interaction.followUp(`${res.text} source: ${res.source_url}`);
  }
}