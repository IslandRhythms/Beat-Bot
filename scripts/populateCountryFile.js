'use strict';
const axios = require('axios');
const fs = require('fs/promises');

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

  const countryInfo = await axios.get(`https://restcountries.com/v3.1/all?fields=name,cca2,ccn3,cca3,cio`).then(res => res.data);

  const reformattedData = countryInfo.map(x => ({ commonName: x.name.common, officialName: x.name.official, cca2: x.cca2, ccn3: x.ccn3, cca3: x.cca3, cioc: x.cioc }));

  
  await fs.writeFile(`../${fileName}`, JSON.stringify(reformattedData, null, 2))
  console.log('done');
}