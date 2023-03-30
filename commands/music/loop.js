const { SlashCommandBuilder } = require('discord.js')
const { useQueue } = require('discord-player'); 

// https://discord-player.js.org/docs/guides/common-actions#looping-the-queue
module.exports = {
  data: new SlashCommandBuilder().setName('loop').setDescription('loops the current song')
  .addIntegerOption(option => option.setName('mode').setDescription('specifies how to loop')
  .setRequired(true)
  .addChoices({ name: 'off', value: 0}, { name: 'track', value: 1}, { name: 'queue', value: 2 }, { name: 'autoplay', value: 3 })),
  async execute(interaction) {
    // need to check if the user is in the same voice channel as the bot
    const mode = interaction.options.getInteger('mode');
    if (!interaction.member.voice.channel) {
      return interaction.reply({ content: 'You must be in a voice channel to use this command', ephemeral: true });
    }
    if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      return interaction.followUp({ content: 'You must be in the same voice channel as me', ephemeral: true });
    }
    const serverQueue = useQueue(interaction.guild.id);
    if (!serverQueue) return interaction.reply({ content: 'Nothing to loop', ephemeral: true });

    if (serverQueue.repeatMode == mode) {
      return interaction.reply({ content: 'Its already set to that.', ephemeral: true });
    }
    serverQueue.setRepeatMode(mode);
    return interaction.reply('Will do chief');
  }
}
