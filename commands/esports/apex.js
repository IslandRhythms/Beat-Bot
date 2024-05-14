'use strict';
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder().setName('apex').setDescription('get apex esport information')
  .addSubcommand(subcommand => 
    subcommand.setName('teams').setDescription('get the participating teams for the year')
      .addStringOption(option => option.setName('year').setDescription('the year you wish to look up').setRequired(true)
    )
  )
  .addSubcommand(subcommand => 
    subcommand.setName('getgroups').setDescription('get information about the indicated group stage')
      .addStringOption(option => option.setName('year').setDescription('the year you wish to look up').setRequired(true))
      .addStringOption(option => option.setName('stage').setDescription('the stage you wish to look up')
      .addChoices(
        { name: 'Split 1', value: 'proleague-split-1-regular-season' },
        { name: 'Split 1 Playoffs Group Stage', value: 'proleague-playoffs-split-1-group-stage' },
        { name: 'Split 2 Playoffs Group Stage', value: 'proleague-playoffs-split-2-group-stage' },
        { name: 'Split 2', value: 'proleague-split-2-regular-season' },
      ).setRequired(true))
      .addStringOption(option => option.setName('region').setDescription('what region groups to look up').addChoices(
        { name: 'North America', value: 'north-america' },
        { name: 'EMEA', value: 'europe-middle-east-and-africa' },
        { name: 'APAC-N', value: 'asia-pacific-north'},
        { name: 'APAC-S', value: 'asia=pacific-south'}
      ).setRequired(true))
  ),
  async execute(interaction, conn) {
    const year = interaction.options.getString('year');
    const stage = interaction.options.getString('stage');
    const region = interaction.options.getString('region');

    const sub = interaction.options._subcommand;
    if (sub == 'teams') { // This is just all active teams for the season, not necessarily the ones at an event.
      const max = 250; // Put an absurd amount, get the right number anyway.
      const { data } = await axios.get(`https://d3q4fnxloga6gz.cloudfront.net/algs-season-${year}/team-stats/type/pro-league?limit=${max}&offset=0`).then(res => res.data);
      if (data.length == 0) {
        return interaction.followUp(`Could not get the teams for the provided year ${year}`);
      }
      // sort and process, may require region to make it more streamlined
      // https://majestic.battlefy.com/algs-season-4/events/most-recent-lineup-by-team-id/${teamId} for the current team roster
    } else if (sub == 'getgroups') {
      // https://majestic.battlefy.com/algs-season-4/events/event-by-slug/proleague-split-2-regular-season
      // look at regionalEvents property. Should use region here
      // only works for group stages
      const data = await axios.get(`https://majestic.battlefy.com/algs-season-${year}/events/event-by-slug/${stage}`).then(res => res.data);
    }

    return interaction.followUp(`Under Construction`)
  }
}

/*
.addStringOption(option => option.setName('year').setDescription('the year you wish to look up').setRequired(true))
  .addStringOption(option => option.setName('stage').setDescription('the stage you wish to look up').setRequired(true)
  .addChoices(
    { name: 'Split 1', value: 'pro-league-split-1' },
    { name: 'Split 1 Playoffs', value: 'pro-league-split-1-playoffs' },
    { name: 'Split 2', value: 'pro-league-split-2' },
    { name: 'Split 2 Qualifier', value: 'pro-league-qualifier' },
    { name: 'Split 2 Playoffs', value: 'pro-league-split-2-playoffs' },
    { name: 'Last Chance Qualifier', value: 'last-chance-qualifier' },
    { name: 'Championship', value: 'championship' }
  ))
  .addStringOption('region').addChoices(),
*/