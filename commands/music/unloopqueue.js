const { SlashCommandBuilder } = require("discord.js");
const { queue, repeatQueue } = require("../../index");


module.exports = {
  data: new SlashCommandBuilder().setName('UnloopQueue').setDescription('cancles the order to loop the current queue.'),
  async execute(interaction) {
    const serverQueue = queue.get(interaction.guild.id);
    // need to check if bot is in same channel as user
    if (!interaction.member.voice.channel) {
      return interaction.reply({ content: 'You must be in a voice channel to use this command', ephemeral: true });
    }
    if (!serverQueue) {
      return interaction.reply({ content: 'nothing to unloop!', ephemeral: true });
    }
    if (!repeatQueue) {
      return interaction.reply({ content: 'Already unlooped!', ephemeral: true });
    }
    repeatQueue = false;
    return interaction.reply('Will repeat the queue boss!');
  }
}
