const { SlashCommandBuilder } = require('discord.js');
const { queue, repeatQueue } = require("../../index");


module.exports = {
  data: new SlashCommandBuilder().setName('LoopQueue').setDescription('Loops the queue'),
  async execute(interaction) {
    // need to check if user is in same voice channel as bot
    if (!interaction.member.voice.channel) {
      return interaction.reply({ content: 'You must be in a voice channel to use this command', ephemeral: true });
    }
    const serverQueue = queue.get(interaction.guild.id);
    if (!serverQueue) return interaction.reply({ content: 'Nothing to loop', ephemeral: true });
    if (repeatQueue) return interaction.reply({ content: 'Already looping!', ephemeral: true });
    repeatQueue = true;
    return interaction.reply('The queue will be repeated once all songs have been played!')
  }
}
