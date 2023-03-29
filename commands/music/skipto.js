const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder().setName('skipto')
  .setDescription('skips to the indicated position in the queue, removing the other songs in queue')
  .addIntegerOption(option => option.setName('position').setDescription('the position').setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply();
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel)
      return interaction.followUp({ content: "You need to be in a voice channel to play music!", ephemeral: true });
      // need to test this
    if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      return interaction.followUp({ content: 'You must be in the same voice channel as me', ephemeral: true });
    }
    const position = interaction.options.getInteger('position');
    if (position > queue.getSize()) {
      return interaction.followUp({ content: 'Indicated position is greater than size of the queue', ephemeral: true });
    }
    const queue = useQueue(interaction.guild.id);
    queue.node.skipTo(position);

    return interaction.followUp(`Skipped to ${position}`);
  }
}