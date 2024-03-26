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
    url: 'https://v1.american-football.api-sports.io/leagues',
    headers: {
      'x-rapidapi-key': process.env.SPORTSAPIKEY,
      'x-rapidapi-host': 'v1.american-football.api-sports.io'
    }
  };

  const  { response } = await axios(config).then(res => res.data);
  const NFL = response.find(x => x.league.name == 'NFL');
  const NCAA = response.find(x => x.league.name == 'NCAA');

  const footballData = { NFL: { id: NFL.league.id, logo: NFL.league.logo, seasons: NFL.seasons, teams: [] },
    NCAA: { id: NCAA.league.id, logo: NCAA.league.logo, seasons: NCAA.seasons, teams: [] }
  };
  const keys = Object.keys(footballData);
  for (let i = 0; i < keys.length; i++) {
    const season = hockeyData[keys[i]].seasons.sort(function (a,b) {
      if (a.year < b.year) {
        return 1;
      }
      else {
        return -1;
      }
    })[0];
    config.url = `https://v1.american-football.api-sports.io/teams?league=${footballData[keys[i]].id}&season=${season.year}`;
    const teamsData = await axios(config).then(res => res.data).catch(e => e.code);
    const ignore = ['NFC', 'AFC']
    const reformattedData = teamsData.response.filter(x => x.name != null || !ignore.includes(x.name)).map(x => ({ id: x.id, name: x.name, logo: x.logo }));
    footballData[keys[i]].teams = reformattedData;
  }


  
  await fs.writeFile(`../${fileName}`, JSON.stringify(footballData, null, 2))
  console.log('done');
}