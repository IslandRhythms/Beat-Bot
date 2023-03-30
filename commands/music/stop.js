const { SlashCommandBuilder } = require("discord.js");
const { useQueue } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder().setName('stop').setDescription("stops the music, feelsbadman don't be a party pooper"),
  async execute(interaction) {
    await interaction.deferReply();
    const serverQueue = useQueue(interaction.guild.id);
    // need to check if bot is in same channel as user
    if (!interaction.member.voice.channel) {
      return interaction.followUp({ content: 'You must be in a voice channel to use this command', ephemeral: true });
    }
    if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      return interaction.followUp({ content: 'You must be in the same voice channel as me', ephemeral: true });
    }
    if (!serverQueue) {
      return interaction.followUp({ content: 'Nothing is playing', ephemeral: true });
    }
    serverQueue.delete();
    return interaction.followUp({ content: 'Stopped the queue, party pooper :( '});
  }
}
