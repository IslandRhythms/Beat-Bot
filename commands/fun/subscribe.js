const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('subscribe')
  .setDescription('"subscribe" to someone in the server')
  .addUserOption(option => option.setName('streamer').setDescription('The big time streamer you want to subscribe to. Enter yourself to see your subs.').setRequired(true)),
  async execute(interaction, conn) {
    await interaction.deferReply();
    const streamer = interaction.options.getUser('streamer');
    const { User } = conn.models;
    const user = await User.findOne({
      discordId: streamer.id
    });
    if (user) {
      if (streamer.id == interaction.user.id) {
        return interaction.followUp({ content: `You have ${user.subscribers} subscriber(s)`, ephemeral: true });
      }
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