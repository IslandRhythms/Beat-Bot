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
    method: 'get',
    url: 'https://v1.basketball.api-sports.io/leagues',
    headers: {
      'x-rapidapi-key': process.env.SPORTSAPIKEY,
      'x-rapidapi-host': 'v1.basketball.api-sports.io'
    }
  };

  const  { response } = await axios(config).then(res => res.data);
  const NBA = response.find(x => x.name == 'NBA');
  const NCAA = response.find(x => x.name == 'NCAA');
  console.log('what is NBA', NBA, 'what is NCAA', NCAA);
  const basketballData = { NBA: { id: NBA.id, logo: NBA.logo, seasons: NBA.seasons, countryId: NBA.country.id, teams: [] },
    NCAA: { id: NCAA.id, logo: NCAA.logo, seasons: NCAA.seasons, countryId: NCAA.country.id, teams: [] }
  };
  const keys = Object.keys(basketballData);
  for (let i = 0; i < keys.length; i++) {
    console.log(basketballData[keys[i]].id)
    // league=${basketballData[keys[i]].id}&country_id=${basketballData[keys[i]].countryId}&season=${basketballData[keys[i]].seasons[0].season}
    config.url = `https://v1.basketball.api-sports.io/teams?id=139`;
    console.log('what is config', config);
    const teamsData = await axios.get(config).then(res => res.data).catch(e => e.code);
    console.log('what is teamsData', teamsData);
    const reformattedData = teamsData.response.map(x => ({ id: x.id, name: x.name, logo: x.logo }));
    basketballData[keys[i]].teams = reformattedData;
  }


  
  await fs.writeFile(`../${fileName}`, JSON.stringify(basketballData, null, 2))
  console.log('done');
}