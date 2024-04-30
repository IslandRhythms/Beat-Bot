const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const teams = require('../../sportsData/valorantTeams.json');

module.exports = {
  data: new SlashCommandBuilder().setName('valorant')
  .setDescription('Get valorant esports related information')
  .addSubcommandGroup(option => option.setName('match').setDescription('match')
    .addSubcommand(subcommand => subcommand.setName('upcoming').setDescription('get the upcoming valorant match'))
    .addSubcommand(subcommand => subcommand.setName('live_score').setDescription('Get the in progress match'))
    .addSubcommand(subcommand => subcommand.setName('results').setDescription('get the results of the most recent match')))
  // api does not support this idea at the time, only returns 17 in the payload.
  /*.addSubcommand(option => option.setName('search').setDescription('search for the most recent match involving a team or two teams')
    .addStringOption(option => option.setName('when').setDescription('If the match is in the future or the past').setRequired(true)
      .addChoices(
        { name: 'Results', value: 'results' },
        { name: 'Upcoming', value: 'upcoming'}
      )
    )
    .addStringOption(option => option.setName('region').setDescription('the region of the first team').setRequired(true)
      .addChoices(
        { name: 'North America', value: 'na'},
        { name: 'Europe', value: 'eu'},
        { name: 'Asia-Pacific', value: 'ap'},
        { name: 'Latin America North', value: 'la-n'},
        { name: 'Latin America South', value: 'la-s'},
        { name: 'Oceania', value: 'oce'},
        { name: 'Korea', value: 'kr'},
        { name: 'Mena', value: 'mn'},
        { name: 'Game Changers', value: 'gc'},
        { name: 'Brazil', value: 'br'},
        { name: 'China', value: 'cn'}
      )
    )
    .addStringOption(option => option.setName('team1').setDescription('the name of the first team').setRequired(true).setAutocomplete(true))
    .addStringOption(option => option.setName('team2').setDescription('the team they played').setAutocomplete(true))
  )*/
  .addSubcommand(subcommand => subcommand.setName('news').setDescription('get the most recent valorant news')),
  async autocomplete(interaction) {
    let focusedValue = interaction.options.getFocused(true);
    if (focusedValue.value == '') {
      focusedValue = null;
    } else {
      focusedValue = focusedValue.value.toLowerCase();
    }
    
    if (interaction.options.getString('region')) {
      const region = interaction.options.getString('region');
      const roster = teams[region].filter(choice => choice.team.toLowerCase().includes(focusedValue));
      return await interaction.respond(roster.map(choice => ({ name: choice.team, value: choice.team })));
    } else {
      const roster = Object.values(teams).flat().filter(choice => choice.team.toLowerCase().includes(focusedValue));
      return await interaction.respond(roster.map(choice => ({ name: choice.team, value: choice.team })));
    }
  },
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
    } /*else if (subcommand == 'search') {
      const when = interaction.options.getString('when');
      const team1 = interaction.options.getString('team1');
      const { data } = await axios.get(`https://vlrggapi.vercel.app/match?q=${when}`).then(res => res.data);
      const segments = data.segments;
      console.log('what is segments length', segments.length)
      let matches = segments.filter(x => x.team1.toLowerCase() == team1.toLowerCase() || x.team2.toLowerCase() == team1.toLowerCase());
      console.log('what is matches', matches);
      if (interaction.options.getString('team2')) {
        console.log('there should be no team2');
        const team2 = interaction.options.getString('team2');
        matches = matches.filter(x => x.team1.toLowerCase() == team2.toLowerCase() || x.team2.toLowerCase() == team2.toLowerCase())
      }
      const information = matches[0];
      // data is already sorted
      if (when == 'upcoming') {
        embed = new EmbedBuilder().setTitle(`:${information.flag1}: ${information.team1} vs ${information.team2} :${information.flag2}: ${new Date(information.unix_timestamp).toLocaleString('en-US', { timeZone: 'AST'})}`)
        .setURL(`${information.match_page}`)
        .setDescription(`${information.time_until_match}`)
        .setAuthor({ name: `${information.match_event} ${information.match_series}` });
      } else if (when == 'results') {
        embed = new EmbedBuilder().setTitle(`:${information.flag1}: ${information.team1} vs ${information.team2} :${information.flag2}: ${new Date(information.unix_timestamp).toLocaleString('en-US', { timeZone: 'AST'})}`)
        .setURL(`https://www.vlr.gg${information.match_page}`)
        .setDescription(`${information.time_completed}`)
        .setAuthor({ name: `${information.tournament_name} ${information.round_info}` })
        .addFields({ name: `:${information.flag1}: ${information.team1}`, value: `${information.score1}`, inline: true }, { name: `:${information.flag2}: ${information.team2}`, value: `${information.score2}`, inline: true }, { name: '\u200b', value: '\u200b', inline: true })
        .setImage(`${information.tournament_icon}`);
      }
    }*/
    else {
      const { data } = await axios.get(`https://vlrggapi.vercel.app/${group}?q=${subcommand}`).then(res => res.data);
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