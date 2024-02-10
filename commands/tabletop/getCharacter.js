const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Pagination } = require('pagination.djs');

// how do we display multiple?
module.exports = {
  data: new SlashCommandBuilder().setName('getcharacter')
  .setDescription('get all of your characters. Provide an id or name to get a specific one')
  .addStringOption(option => option.setName('characterid').setDescription('the id of your character'))
  .addStringOption(option => option.setName('name').setDescription('the name of your character')),
  async execute(interaction, conn) {
    const pagination = new Pagination(interaction);
    await interaction.deferReply();
    const { User, Character } = conn.models;

    await interaction.followUp('Under Construction');
  }
}