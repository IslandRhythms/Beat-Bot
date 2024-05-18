const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder().setName('diagnostics')
  .setDescription('get diagnostics of Beat Bot'),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const memoryUsage = process.memoryUsage();
    const serverInfo = {
      name: interaction.guild.name,
      id: interaction.guild.id,
      region: interaction.guild.preferredLocale,
      owner: (await interaction.guild.fetchOwner()).displayName,
      memberCount: interaction.guild.memberCount,
      creationDate: new Date(interaction.guild.createdAt).toLocaleString()
    };

    const botInfo = {
      username: interaction.client.user.username,
      creationDate: new Date(interaction.client.user.createdAt).toLocaleString(),
      status: interaction.client.user.presence.status,
      uptime: process.uptime(),
      avatarURL: interaction.client.user.avatarURL()
    };
    const embed = new EmbedBuilder().setTitle(`Beat Bot Diagnostics`)
    .addFields(
      { name: `Server Information`, value: `========================` },
      { name: `Server Region`, value: `${serverInfo.region}` },
      { name: `Server Owner`, value: `${serverInfo.owner}` },
      { name: `Member Count`, value: `${serverInfo.memberCount}` },
      { name: `Creation Date`, value: `${serverInfo.creationDate}` },
      { name: `Bot Information`, value: `========================` },
      { name: `Name`, value: `${botInfo.username}` },
      { name: `Profile Picture`, value: `${botInfo.avatarURL}`},
      { name: `Ping`, value: `${interaction.createdTimestamp - Date.now()}ms` },
      { name: `Uptime`, value: `${botInfo.uptime.toFixed(2)}s` },
      { name: `Status`, value: `${botInfo.status}` },
      { name: `creation date`, value: `${botInfo.creationDate}` },
      { name: `Memory Usage`, value: `========================` },
      { name: `RSS`, value: `${formatBytes(memoryUsage.rss)}` },
      { name: `Heap Total`, value: `${formatBytes(memoryUsage.heapTotal)}` },
      { name: `Heap Used`, value: `${formatBytes(memoryUsage.heapUsed)}` },
      { name: `External`, value: `${formatBytes(memoryUsage.external)}` }
    )
    return interaction.followUp({ embeds: [embed] });
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = 2;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}