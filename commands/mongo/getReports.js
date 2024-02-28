const { SlashCommandBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder().setName('getreports')
  .setDescription('get reports you\'ve created'),
  async execute(interaction, conn) {
    await interaction.deferReply();
    const { User, BugReport } = conn.models;
    const user = await User.findOne({ discordId: interaction.user.id });
    // how do I make myself the exception? env
    const reports = await BugReport.find({ reporter: user._id });
    // do processing
    await interaction.followUp('Under Construction');
  }
}