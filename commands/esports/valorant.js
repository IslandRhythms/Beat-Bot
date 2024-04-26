const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder().setName('valorant')
  .setDescription('Get valorant esports related information')
  .addSubcommandGroup(option => option.setName('match').setDescription('match')
    .addSubcommand(subcommand => subcommand.setName('upcoming').setDescription('get the upcoming valorant match'))
    .addSubcommand(subcommand => subcommand.setName('live_score').setDescription('Get the in progress match'))
    .addSubcommand(subcommand => subcommand.setName('results').setDescription('get the results of the most recent match')))
  .addSubcommand(subcommand => subcommand.setName('news').setDescription('get the most recent valorant news')),
  async execute(interaction) {
    await interaction.deferReply();
    const subcommand = interaction.options._subcommand;
    const group = interaction.options._group;
    let embed = null;
    if (subcommand == 'news') {
      const { data } = await axios.get(`https://vlrggapi.vercel.app/${subcommand}`).then(res => res.data);
      const information = data.segments[0];
      embed = new EmbedBuilder().setTitle(`${information.title}`)
      .setURL(`${information.url_path}`)
      .setDescription(`${information.description}`)
      .setTimestamp(new Date(information.date))
      .setAuthor({ name: `${information.author}` });
    } else {
      const { data } = await axios.get(`https://vlrggapi.vercel.app/${group}/${subcommand}`).then(res => res.data);
      const information = data.segments[0];
      if (subcommand == 'upcoming') {
        embed = new EmbedBuilder().setTitle(`:${information.flag1}: ${information.team1} vs ${information.team2} :${information.flag2}: ${new Date(information.unix_timestamp).toLocaleString('en-US', { timeZone: 'AST'})}`)
        .setURL(`${information.match_page}`)
        .setDescription(`${information.time_until_match}`)
        .setAuthor({ name: `${information.match_event} ${information.match_series}` });
      } else if (subcommand == 'live_score') {
        embed = new EmbedBuilder().setTitle(`:${information.flag1}: ${information.team1} vs ${information.team2} :${information.flag2}: ${new Date(information.unix_timestamp).toLocaleString('en-US', { timeZone: 'AST'})}`)
        .setURL(`${information.match_page}`)
        .setDescription(`${information.time_until_match} ${information.current_map} Map ${information.map_number}`)
        .setAuthor({ name: `${information.match_event} ${information.match_series}` })
        .addFields({ name: `:${information.flag1}: ${information.team1}`, value: `${information.score1}`, inline: true }, { name: `:${information.flag2}: ${information.team2}`, value: `${information.score2}`, inline: true }, { name: '\u200b', value: '\u200b', inline: true })
        .addFields({ name: `${information.team1} CT side`, value: `${information.team1_round_ct}`, inline: true }, { name: `${information.team2} T side`, value: `${information.team2_round_t}`, inline: true }, { name: '\u200b', value: '\u200b', inline: true })
        .addFields({ name: `${information.team1} T side`, value: `${information.team1_round_t}`, inline: true }, { name: `${information.team2} CT side`, value: `${information.team2_round_ct}`, inline: true }, { name: '\u200b', value: '\u200b', inline: true })
      } else if (subcommand == 'results') {
        embed = new EmbedBuilder().setTitle(`:${information.flag1}: ${information.team1} vs ${information.team2} :${information.flag2}: ${new Date(information.unix_timestamp).toLocaleString('en-US', { timeZone: 'AST'})}`)
        .setURL(`https://www.vlr.gg${information.match_page}`)
        .setDescription(`${information.time_completed}`)
        .setAuthor({ name: `${information.tournament_name} ${information.round_info}` })
        .addFields({ name: `:${information.flag1}: ${information.team1}`, value: `${information.score1}`, inline: true }, { name: `:${information.flag2}: ${information.team2}`, value: `${information.score2}`, inline: true }, { name: '\u200b', value: '\u200b', inline: true })
        .setImage(`${information.tournament_icon}`);
      }
    }

    if (embed) {
      embed.setFooter({ text: 'Possible in part to https://www.vlr.gg/ and https://vlrggapi.vercel.app/#/' });
      return interaction.followUp({ embeds: [embed] })
    } else {
      return interaction.followUp(`Unable to complete request at this time`);
    }
  }
}