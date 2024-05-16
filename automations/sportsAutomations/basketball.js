'use strict';
const axios = require('axios');
const fs = require('fs/promises');
require('../../config');

module.exports = async function basketball() {
  const config = {
    method: 'GET',
    url: 'https://v1.basketball.api-sports.io/leagues',
    headers: {
      'x-rapidapi-key': process.env.SPORTSAPIKEY,
      'x-rapidapi-host': 'v1.basketball.api-sports.io'
    }
  };

  const  { response } = await axios(config).then(res => res.data);
  const NBA = response.find(x => x.name == 'NBA');
  const NCAA = response.find(x => x.name == 'NCAA');
  const basketballData = { NBA: { id: NBA.id, logo: NBA.logo, seasons: NBA.seasons, countryId: NBA.country.id, teams: [] },
    NCAA: { id: NCAA.id, logo: NCAA.logo, seasons: NCAA.seasons, countryId: NCAA.country.id, teams: [] }
  };
  const keys = Object.keys(basketballData);
  for (let i = 0; i < keys.length; i++) {
    const season = basketballData[keys[i]].seasons.sort(function (a,b) {
      if (a.season < b.season) {
        return 1;
      }
      else {
        return -1;
      }
    })[0];
    config.url = `https://v1.basketball.api-sports.io/teams?league=${basketballData[keys[i]].id}&country_id=${basketballData[keys[i]].countryId}&season=${season.season}`;
    const teamsData = await axios(config).then(res => res.data).catch(e => e.code);
    const ignore = ['West', 'East'];
    const reformattedData = teamsData.response.filter(x => x.name != null && !ignore.includes(x.name)).map(x => ({ id: x.id, name: x.name, logo: x.logo }));
    basketballData[keys[i]].teams = reformattedData;
  }


  
  await fs.writeFile(`./sportsData/Basketball.json`, JSON.stringify(basketballData, null, 2))
}