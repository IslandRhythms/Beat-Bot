const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { useQueue } = require('discord-player')


module.exports = {
  data: new SlashCommandBuilder().setName('queue').setDescription('shows the queue of songs'),
  async execute(interaction) {
    await interaction.deferReply()
    const serverQueue = useQueue(interaction.guild.id);
    if (!serverQueue.tracks.toArray().length && !serverQueue.currentTrack) {
      return interaction.followUp("No songs in the queue");
    }
    const titleArray = [];
    serverQueue.tracks.toArray().slice(0, serverQueue.tracks.toArray().length).forEach((track) => {
      titleArray.push(track.title);
    });
    
    let queueEmbed = new EmbedBuilder()
      .setColor("#ff7373")
      .setTitle(`Music Queue - ${titleArray.length} items`);
      queueEmbed.addFields({ name: 'Currently Playing', value: serverQueue.currentTrack.title });
      for (let i = 0; i < titleArray.length; i++) {
        queueEmbed.addFields({ name: (i+1).toString(), value: titleArray[i]});
      }
    return interaction.followUp({ embeds: [queueEmbed] });
  }
}
