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

  const groups = ['na', 'eu', 'ap', 'la-s', 'la-n', 'oce', 'kr', 'mn', 'gc', 'br', 'cn']
  const valorantTeams = {};
  for (let i = 0; i < groups.length; i++) {
    valorantTeams[groups[i]] = {};
    const { data } = await axios(`https://vlrggapi.vercel.app/rankings/${groups[i]}`).then(res => res.data);
    valorantTeams[groups[i]] = data.map(x => ({ team: x.team, country: x.country, record: x.record, logo: x.logo, rank: x.rank }));
  }
  
  await fs.writeFile(`../${fileName}`, JSON.stringify(valorantTeams, null, 2))
  console.log('done');
}