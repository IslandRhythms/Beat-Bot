const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('donate')
  .setDescription('"donate" to someone in the server')
  .addUserOption(option => option.setName('streamer').setDescription('The big time streamer you want to donate to.').setRequired(true)),
  async execute(interaction, conn) {
    await interaction.deferReply();
    const { User } = conn.models;
    const streamer = interaction.options.getUser('streamer');
    const user = await User.findOne({
      discordId: streamer.id
    });
    user.bits += 1;
    await user.save();
    await interaction.reply(`<@${interaction.user.id}> has just subscribed to <@${streamer.id}>`);
  }
}