'use strict';
const axios = require('axios');
const fs = require('fs/promises');
require('../config');

run().catch(e => {
  console.log(e);
  process.exit(-1)
})

async function run() {
  if (!process.argv[2]) {
    throw new Error('Must provide fileName');
  }
  // include file type
  const fileName = process.argv[2];

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
    const reformattedData = teamsData.response.map(x => ({ id: x.id, name: x.name, logo: x.logo }));
    basketballData[keys[i]].teams = reformattedData;
  }


  
  await fs.writeFile(`../${fileName}`, JSON.stringify(basketballData, null, 2))
  console.log('done');
}