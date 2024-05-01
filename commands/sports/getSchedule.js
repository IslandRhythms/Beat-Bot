const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const commandDef = require('./common/commandDef');
const sportsAutocomplete = require('./common/autocomplete');

module.exports = {
  data: commandDef('schedule', 'Get your sports team\'s schedule for the year.'),
  async autocomplete(interaction) {
    return sportsAutocomplete(interaction);
  },
  async execute(interaction) {
    await interaction.deferReply();
    await interaction.followUp('Under Construction');
  }
}