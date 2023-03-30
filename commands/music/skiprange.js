const { SlashCommandBuilder } = require("discord.js");
const { useQueue } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder().setName('skiprange')
  .setDescription('Skips all songs in the given range')
  .addIntegerOption(option => option.setName('start')
   .setDescription('starting index').setRequired(true))
  .addIntegerOption(option => option.setName('end').setDescription('end index').setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply();
    const serverQueue = useQueue(interaction.guild.id);
    const start = interaction.options.getInteger('start');
    const end = interaction.options.getInteger('end');
    let song = start;
    // need to check if bot is in same channel as user
    if (!interaction.member.voice.channel) {
      return interaction.followUp({ content: 'You must be in a voice channel to use this command', ephemeral: true });
    }
    if (start > serverQueue.length || end > serverQueue.length) {
      return interaction.followUp({ content: 'The range exceeds the queue size', ephemeral: true });
    }
    if (start == 0) {
      song++;
    }
    for (let i = song - 1; i < end ; i++) {
      // the array size changes after every remove
      serverQueue.removeTrack(song-1);
    }
    if (start == 0) {
      serverQueue.node.skip();
    }
    return interaction.followUp('Songs removed!');
  }
}