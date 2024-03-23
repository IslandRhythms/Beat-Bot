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
    url: 'https://v1.baseball.api-sports.io/leagues',
    headers: {
      'x-rapidapi-key': process.env.SPORTSAPIKEY,
      'x-rapidapi-host': 'v1.baseball.api-sports.io'
    }
  };

  const  { response } = await axios(config).then(res => res.data);
  const MLB = response.find(x => x.name == 'MLB');
  const NCAA = response.find(x => x.name == 'NCAA');
  const baseballData = { MLB: { id: MLB.id, logo: MLB.logo, seasons: MLB.seasons, countryId: MLB.country.id, teams: [] },
    NCAA: { id: NCAA.id, logo: NCAA.logo, seasons: NCAA.seasons, countryId: NCAA.country.id, teams: [] }
  };
  const keys = Object.keys(baseballData);
  for (let i = 0; i < keys.length; i++) {
    config.url = `https://v1.basketball.api-sports.io/teams?league=${baseballData[keys[i]].id}&country_id=${baseballData[keys[i]].countryId}&season=${baseballData[keys[i]].seasons[0].season}`;
    const teamsData = await axios(config).then(res => res.data).catch(e => e.code);
    const reformattedData = teamsData.response.map(x => ({ id: x.id, name: x.name, logo: x.logo }));
    baseballData[keys[i]].teams = reformattedData;
  }


  
  await fs.writeFile(`../${fileName}`, JSON.stringify(basketballData, null, 2))
  console.log('done');
}