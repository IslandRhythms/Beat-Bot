
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

// https://discord.js.org/#/docs/builders/main/class/SlashCommandBuilder?scrollTo=addMentionableOption

module.exports = {
  data: new SlashCommandBuilder().setName('plant')
  .setDescription('Get more information on the plant of the day.'),
  async execute(interaction, conn) {
    const { Daily } = conn.models;
    const doc = await Daily.findOne().sort({ createdAt: -1 });
    await interaction.deferReply();
    const embed = new EmbedBuilder();
    await interaction.followUp({ embeds: [embed] })
  }
}