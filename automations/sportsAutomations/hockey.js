'use strict';
const axios = require('axios');
const fs = require('fs/promises');
require('../../config');

module.exports = async function Hockey() {
  const config = {
    method: 'GET',
    url: 'https://v1.hockey.api-sports.io/leagues',
    headers: {
      'x-rapidapi-key': process.env.SPORTSAPIKEY,
      'x-rapidapi-host': 'v1.hockey.api-sports.io'
    }
  };

  const  { response } = await axios(config).then(res => res.data);
  const NHL = response.find(x => x.name == 'NHL');
  const NCAA = response.find(x => x.name == 'NCAA');
  const hockeyData = { NHL: { id: NHL.id, logo: NHL.logo, seasons: NHL.seasons, countryId: NHL.country.id, teams: [] },
    NCAA: { id: NCAA.id, logo: NCAA.logo, seasons: NCAA.seasons, countryId: NCAA.country.id, teams: [] }
  };
  const keys = Object.keys(hockeyData);
  for (let i = 0; i < keys.length; i++) {
    const season = hockeyData[keys[i]].seasons.sort(function (a,b) {
      if (a.season < b.season) {
        return 1;
      }
      else {
        return -1;
      }
    })[0];
    config.url = `https://v1.hockey.api-sports.io/teams?league=${hockeyData[keys[i]].id}&country_id=${hockeyData[keys[i]].countryId}&season=${season.season}`;
    const teamsData = await axios(config).then(res => res.data).catch(e => e.code);
    const reformattedData = teamsData.response.filter(x => x.name != null).map(x => ({ id: x.id, name: x.name, logo: x.logo }));
    hockeyData[keys[i]].teams = reformattedData;
  }


  
  await fs.writeFile(`../sportsData/Hockey.json`, JSON.stringify(hockeyData, null, 2))
}
