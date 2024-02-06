'use strict';

const axios = require('axios');
const fs = require('fs/promises');

module.exports = async function parseRollTwentySheet(sheet) {
  const res = await axios.get(sheet.url, { responseType: 'arraybuffer'});
  const fileData = Buffer.from(res.data, 'binary');
  await fs.writeFile(`./${sheet.name}`, fileData);
  const data = await scraper(await fs.readFile(`./${sheet.name}`));
  console.log(data.pages, data.pages.length, data.pages[0]);
  const text = data.pages[0].split('\n');
  console.log('what is text', text);
  const name = text[0];
  const classAndLevel = text[2]; // double check how multiclass looks like here
  const background = text[4];
  const race = text[6];
  const alignment = text[8];
  const xp = text[10];
  const strengthModifier = text[13];
  const strengthScore = text[14];
  const dexMod = text[16];
  const dexScore = text[17];
  const conMod = text[19];
  const conScore = text[20];
  const intMod = text[22];
  const intScore = text[23];
  const wisMod = text[25];
  const wisScore = text[26];
  const charismaMod = text[28];
  const charismaScore = text[29];
  const hitPointString = text[81];
  const firstDigit = hitPointString[hitPointString.length - 2];
  const secondDigit = hitPointString[hitPointString.length - 1];
  let hitPoints = '';
  if (!Number.isNaN(firstDigit)) {
    hitPoints += firstDigit;
  }
  if (!Number.isNaN(secondDigit)) {
    hitPoints += secondDigit;
  }
  return { 
    name,
    classAndLevel,
    background,
    race,
    alignment,
    xp,
    strengthModifier,
    strengthScore,
    dexMod,
    dexScore,
    conMod,
    conScore,
    intMod,
    intScore,
    wisMod,
    wisScore,
    charismaMod,
    charismaScore,
    hitPoints
  };
};