const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('subscribe')
  .setDescription('"subscribe" to someone in the server')
  .addUserOption(option => option.setName('streamer').setDescription('The big time streamer you want to subscribe to.').setRequired(true)),
  async execute(interaction, conn) {
    await interaction.deferReply();
    const streamer = interaction.options.getUser('streamer');
    if (streamer.id == interaction.user.id) {
      return interaction.followUp({ content: `You can't subscribe to yourself`, ephemeral: true });
    }
    const { User } = conn.models;
    const user = await User.findOne({
      discordId: streamer.id
    });
    if (user) {
      if (user.subscribers) {
        user.subscribers += 1;
      } else {
        user.subscribers = 1;
      }
      await user.save();
    }
    return interaction.followUp(`<@${interaction.user.id}> has just subscribed to <@${streamer.id}>. They now have ${user.subscribers} subscribers.`);
  }
}