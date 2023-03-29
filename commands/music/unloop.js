const { SlashCommandBuilder } = require("discord.js");
const { useQueue } = require('discord-player');

// https://discord-player.js.org/docs/guides/common-actions#looping-the-queue
module.exports = {
  data: new SlashCommandBuilder().setName('unloop').setDescription('ends the loop of the song currently playing'),
  async execute(interaction) {
    const serverQueue = useQueue(interaction.guild.id);
    // need to check if bot is in same channel as user
    if (!interaction.member.voice.channel) {
      return interaction.reply({ content: 'You must be in a voice channel to use this command', ephemeral: true });
    }
    if (!serverQueue) {
      return interaction.reply({ content: 'nothing to unloop!', ephemeral: true });
    }
    console.log('what is serverQueue', serverQueue, serverQueue.options.repea);
    if (serverQueue.options.repeatMode == 0) {
      return interaction.reply({ content: 'Already unlooped!', ephemeral: true });
    }
    return interaction.reply('Will unloop boss!');
  }
}
