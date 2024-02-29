require('../../config');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const getDiscordNameFromId = require('../../helpers/getDiscordNameFromId');
const getDiscordAvatar = require('../../helpers/getDiscordAvatar');
const { Pagination } = require('pagination.djs');


module.exports = {
  data: new SlashCommandBuilder().setName('getreports')
  .setDescription('get reports you\'ve created')
  .addStringOption(option => option.setName('bugid').setDescription('the id of the specific bug report you want to look up.'))
  .addStringOption(option => option.setName('status').setDescription('the status of the reports you want to see').addChoices(
    { name: 'Confirmed', value: 'Confirmed' },
    { name: 'Expected', value: 'Expected' },
    { name: 'Fixed', value: 'Fixed' },
    { name: 'Third Party Problem', value: 'Third Party Problem' },
    { name: 'Feature Request', value: 'Feature Request' },
    { name: 'Pending', value: 'Pending' }
  )),
  async execute(interaction, conn) {
    const pagination = new Pagination(interaction);
    await interaction.deferReply();
    const { User, BugReport } = conn.models;
    const user = await User.findOne({ discordId: interaction.user.id });
    const status = interaction.options.getString('status');
    const bugId = interaction.options.getString('bugid');
    const filter = {};
    if (interaction.user.id != process.env.OWNERID) {
      filter.reporter = user._id;
    }

    if (bugId) { // end the function here is a bugId is present
      filter.bugId = bugId;
      const report = await BugReport.findOne(filter).populate('reporter');
      const author = getDiscordNameFromId(report.reporter.discordId);
      const avatar = getDiscordAvatar({ id: report.reporter.discordId, avatar: report.reporter.avatar });
      const embed = new EmbedBuilder()
      .setTitle(`${report.title} Status: ${report.status}`)
      .setDescription(report.description)
      .setAuthor({ name: author, iconUrl: avatar })
      .addFields({ name: 'Status', value: report.status, inline: true }, { name: 'BugId', value: report.bugId, inline: true })
      return interaction.followUp({ embeds: [embed] });
    }

    if (status) {
      filter.status = status;
    }
    const embeds = [];
    const reports = await BugReport.find(filter).sort({ createdAt: -1 }).populate('reporter')
    for (let i = 0; i < reports.length; i++) {
      const report = reports[i];
      const author = getDiscordNameFromId(report.reporter.discordId);
      const avatar = getDiscordAvatar({ id: report.reporter.discordId, avatar: report.reporter.avatar });
      const embed = new EmbedBuilder()
      .setTitle(`${report.title}`)
      .setDescription(report.description)
      .setAuthor({ name: author, iconUrl: avatar })
      .addFields({ name: 'Status', value: report.status, inline: true }, { name: 'BugId', value: report.bugId, inline: true })
      embeds.push(embed);
    }
    pagination.setEmbeds(embeds, (embed, index, array) => {
      return embed.setFooter({ text: `Page: ${index + 1}/${array.length}` });
    });
    pagination.render();
    // do processing
    // await interaction.followUp('Under Construction');
  }
}