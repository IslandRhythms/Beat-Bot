'use strict';

const zodiac = require('../zodiac.json');
const fs = require('fs/promises');
async function run() {
  const baseLine = zodiac[0];
  for (let i = 1; i < zodiac.length; i++) {
    const sign = zodiac[i];
    for (let j = 0; j < baseLine.years.length; j++) {
      sign.years.push(baseLine.years[j] + i)
    }
  }
  console.log('what is zodiac', zodiac);
  await fs.writeFile('../zodiac.json', JSON.stringify(zodiac, null, 2))
}

run();