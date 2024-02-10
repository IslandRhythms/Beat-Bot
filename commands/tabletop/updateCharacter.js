const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// how do we display multiple?
module.exports = {
  data: new SlashCommandBuilder().setName('updatecharacterproperties')
  .setDescription('Update a Specific character')
  .addStringOption(option => option.setName('characterid').setDescription('the id of your character'))
  .addStringOption(option => option.setName('name').setDescription('the name of your character')),
  async execute(interaction, conn) {
    await interaction.deferReply();
    const { User, Character } = conn.models;

    await interaction.followUp('Under Construction');
  }
}