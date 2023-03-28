const { queue } = require("../../index");
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");


module.exports = {
  data: new SlashCommandBuilder().setName('queue').setDescription('shows the queue of songs'),
  async execute(interaction) {
    const serverQueue = queue.get(interaction.guild.id);
    if (!serverQueue.songs.length)
      return interaction.reply("No songs in the queue");
    const titleArray = [];
    serverQueue.songs.slice(0, serverQueue.songs.length).forEach((track) => {
      titleArray.push(track.title);
    });
    let queueEmbed = new EmbedBuilder()
      .setColor("#ff7373")
      .setTitle(`Music Queue - ${titleArray.length} items`);
    for (let i = 0; i < titleArray.length; i++) {
      queueEmbed.addFields(`${i + 1}:`, `${titleArray[i]}`);
    }
    return interaction.reply(queueEmbed);
  }
}
