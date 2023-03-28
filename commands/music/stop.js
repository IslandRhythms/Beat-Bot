const { SlashCommandBuilder } = require("discord.js");
const { queue }= require("../../index");

module.exports = {
  data: new SlashCommandBuilder().setName('stop').setDescription("stops the music, feelsbadman don't be a party pooper"),
  async execute(interaction) {
    const serverQueue = queue.get(interaction.guild.id);
    // need to check if bot is in same channel as user
    if (!interaction.member.voice.channel) {
      return interaction.reply({ content: 'You must be in a voice channel to use this command', ephemeral: true });
    }
    serverQueue.songs.length = 0;
    serverQueue.connection.dispatcher.end();
  }
}
