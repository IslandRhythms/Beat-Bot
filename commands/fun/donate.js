const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('donate')
  .setDescription('"donate" to someone in the server')
  .addUserOption(option => option.setName('streamer').setDescription('The big time streamer you want to donate to.').setRequired(true)),
  async execute(interaction, conn) {
    await interaction.deferReply();
    const streamer = interaction.options.getUser('streamer');
    if (streamer.id == interaction.user.id) {
      return interaction.followUp({ content: `You can't donate to yourself`, ephemeral: true });
    }
    const { User } = conn.models;
    const user = await User.findOne({
      discordId: streamer.id
    });
    if (user) {
      if (user.bits) {
        user.bits += 1000;
      } else {
        user.bits = 1000;
      }
      await user.save();
    }
    return interaction.followUp(`<@${interaction.user.id}> has just donated to <@${streamer.id}>. They now have ${user.bits} bits.`);
  }
}