'use strict';
const axios = require('axios');
const fs = require('fs/promises');
require('../../config');

module.exports = async function Soccer() {
  let url = 'https://v3.football.api-sports.io/leagues';
  const config = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': process.env.SPORTSAPIKEY,
      'x-rapidapi-host': 'v3.football.api-sports.io'
    }
  };

  const leagues = [
    { leagueName: 'Bundesliga', leagueId: 78 },
    { leagueName: 'La Liga', leagueId: 140 },
    { leagueName: 'Serie A', leagueId: 135 },
    { leagueName: 'Premiere League', leagueId: 39 }
  ];

  const soccerData = {};
  for (let i = 0; i < leagues.length; i++) {
    config.url = url+`?id=${leagues[i].leagueId}`;
    const { response } = await axios(config).then(res => res.data);
    const data = response[0];
    soccerData[leagues[i].leagueName] = { id: data.league.id, logo: data.league.logo, country: data.country.name, seasons: data.seasons, teams: [] };
  }
  const keys = Object.keys(soccerData);
  for (let i = 0; i < keys.length; i++) {
    const season = soccerData[keys[i]].seasons.sort(function (a,b) {
      if (a.year < b.year) {
        return 1;
      }
      else {
        return -1;
      }
    })[0];
    config.url = `https://v3.football.api-sports.io/teams?league=${soccerData[keys[i]].id}&season=${season.year}`;
    const teamsData = await axios(config).then(res => res.data).catch(e => e.code);
    const reformattedData = teamsData.response.filter(x => x.team.name != null).map(x => ({ id: x.team.id, name: x.team.name, logo: x.team.logo, country: x.team.country }));
    soccerData[keys[i]].teams = reformattedData;
  }


  
  await fs.writeFile(`../sportsData/Soccer.json`, JSON.stringify(soccerData, null, 2))
}
