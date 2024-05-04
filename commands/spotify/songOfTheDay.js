const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('songoftheday')
  .setDescription('get a link to the song of the day'),
  async execute(interaction, conn) {
    await interaction.deferReply({ ephemeral: true });
    const { Daily } = conn.models;
    const doc = await Daily.findOne().sort({ createdAt: -1 });
    await interaction.followUp(`${doc.songOTD.url}`);
  }
}