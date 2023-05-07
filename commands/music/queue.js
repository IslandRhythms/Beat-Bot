const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { useQueue } = require('discord-player');
const { Pagination } = require('pagination.djs');


module.exports = {
  data: new SlashCommandBuilder().setName('queue').setDescription('shows the queue of songs'),
  async execute(interaction) {
    const pagination = new Pagination(interaction);
    await interaction.deferReply()
    const serverQueue = useQueue(interaction.guild.id);
    if (!serverQueue.tracks.toArray().length && !serverQueue.currentTrack) {
      return interaction.followUp("No songs in the queue");
    }
    const titleArray = [];
    const embeds = [];
    serverQueue.tracks.toArray().slice(0, serverQueue.tracks.toArray().length).forEach((track) => {
      titleArray.push(track.title);
    });
    let queueEmbed = new EmbedBuilder()
      .setColor("#ff7373");
      queueEmbed.addFields({ name: 'Currently Playing', value: serverQueue.currentTrack.title });
      queueEmbed.addFields({ name: 'Progress', value: serverQueue.node.createProgressBar() });
      for (let i = 0; i < titleArray.length; i++) {
        if (i % 10 == 0 && i != 0) {
          embeds.push(queueEmbed);
          queueEmbed = new EmbedBuilder().setColor('#ff7373');
          queueEmbed.addFields({ name: 'Currently Playing', value: serverQueue.currentTrack.title });
          queueEmbed.addFields({ name: 'Progress', value: serverQueue.node.createProgressBar() });
        }
        queueEmbed.addFields({ name: (i+1).toString(), value: titleArray[i]});
      }
      if (queueEmbed.data.fields.length) {
        embeds.push(queueEmbed);
      }
      pagination.setEmbeds(embeds, (embed, index, array) => {
        return embed.setTitle(`Music Queue - ${titleArray.length} items`).setColor("#ff7373");
        // puts these in the footer now
        embed.addFields({ name: 'Currently Playing', value: serverQueue.currentTrack.title });
        embed.addFields({ name: 'Progress', value: serverQueue.node.createProgressBar() });
      });
      pagination.setOptions({ prevDescription: `Currently Playing - ${serverQueue.currentTrack.title}`});
      pagination.render(); // calls interaction.followUp
    // return interaction.followUp({ embeds: [queueEmbed] });
  }
}
