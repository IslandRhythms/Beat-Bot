'use strict';

module.exports = async function preProcessSport(interaction) {
  const league = interaction.options.getString('league');
  const team = interaction.options.getString('team');
  const sport = interaction.options._subcommand;
  let leagueId = '';
  let teamId = '';
  let season = '';
  let nextGame = null;
  if (sport == 'basketball') {
    leagueId = Basketball[league].id;
    const selectedTeam = Basketball[league]['teams'].find(x => x.name == team);
    if (!selectedTeam) {
      return interaction.followUp(`${team} was not found in the ${league} league, please make sure you chose the correct team and league.`);
    }
    teamId = selectedTeam.id;
    season = Basketball[league].seasons.sort(function(a,b) {
      if (a.season < b.season) {
        return 1;
      } else {
        return -1;
      }
    })[0].season;

    const config = {
      method: 'GET',
      url: `https://v1.basketball.api-sports.io/games?league=${leagueId}&team=${teamId}&season=${season}`,
      headers: {
        'x-rapidapi-key': process.env.SPORTSAPIKEY,
        'x-rapidapi-host': `v1.basketball.api-sports.io`
      }
    };
    nextGame = await processSport.processBasketball(config, 'NS');
  } else if (sport == 'soccer') { // use fixtures route
    leagueId = Soccer[league].id;
    const selectedTeam = Soccer[league]['teams'].find(x => x.name == team);
    if (!selectedTeam) {
      return interaction.followUp(`${team} was not found in the ${league} league, please make sure you chose the correct team and league.`);
    }
    teamId = selectedTeam.id;
    season = Soccer[league].seasons.sort(function(a,b) {
      if (a.year < b.year) {
        return 1;
      } else {
        return -1;
      }
    })[0].year;
    nextGame = await processSoccer(leagueId, teamId, season);
  } else if (sport == 'football') {
    leagueId = Football[league].id;
    const selectedTeam = Football[league]['teams'].find(x => x.name == team);
    if (!selectedTeam) {
      return interaction.followUp(`${team} was not found in the ${league} league, please make sure you chose the correct team and league.`);
    }
    teamId = selectedTeam.id;
    season = Football[league].seasons.sort(function(a,b) {
      if (a.year < b.year) {
        return 1;
      } else {
        return -1;
      }
    })[0].year;
    nextGame = await processFootball(leagueId, teamId, season);
  } else if (sport == 'baseball') {
    leagueId = Baseball[league].id;
    const selectedTeam = Baseball[league]['teams'].find(x => x.name == team);
    if (!selectedTeam) {
      return interaction.followUp(`${team} was not found in the ${league} league, please make sure you chose the correct team and league.`);
    }
    teamId = selectedTeam.id;
    season = Baseball[league].seasons.sort(function(a,b) {
      if (a.season < b.season) {
        return 1;
      } else {
        return -1;
      }
    })[0].season;
    nextGame = await processBaseball(leagueId, teamId, season);
  } else if (sport == 'hockey') {
    leagueId = Hockey[league].id;
    const selectedTeam = Hockey[league]['teams'].find(x => x.name == team);
    if (!selectedTeam) {
      return interaction.followUp(`${team} was not found in the ${league} league, please make sure you chose the correct team and league.`);
    }
    teamId = selectedTeam.id;
    season = Hockey[league].seasons.sort(function(a,b) {
      if (a.season < b.season) {
        return 1;
      } else {
        return -1;
      }
    })[0].season;

    const config = {
      method: 'GET',
      url: `https://v1.hockey.api-sports.io/games?league=${leagueId}&team=${teamId}&season=${season}`,
      headers: {
        'x-rapidapi-host': 'v1.hockey.api-sports.io',
        'x-rapidapi-key': process.env.SPORTSAPIKEY
      }
    };
    nextGame = await processSport.processHockey(config, 'NS');
  }
}