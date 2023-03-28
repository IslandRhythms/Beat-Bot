const { SlashCommandBuilder } = require('discord.js')
const { repeat, queue } = require("../../index");


module.exports = {
  data: new SlashCommandBuilder().setName('loop').setDescription('loops the current song'),
  async execute(interaction) {
    // need to check if the user is in the same voice channel as the bot
    if (!interaction.member.voice.channel) {
      return interaction.reply({ content: 'You must be in a voice channel to use this command', ephemeral: true });
    }
    const serverQueue = queue.get(interaction.guild.id);
    if (!serverQueue) return interaction.reply({ content: 'Nothing to loop', ephemeral: true });
    if (repeat) return interaction.reply({ content: 'Already looping!', ephemeral: true });
    repeat = true;
    interaction.reply('Will loop chief');
  }
}
