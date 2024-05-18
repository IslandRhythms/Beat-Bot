'use strict';

const axios = require('axios');
const fs = require('fs/promises');
const scraper = require('pdf-scraper');

module.exports = async function parseRollTwentySheet(sheet) {
  const res = await axios.get(sheet.url, { responseType: 'arraybuffer'});
  const fileData = Buffer.from(res.data, 'binary');
  await fs.writeFile(`./${sheet.name}`, fileData);
  const data = await scraper(await fs.readFile(`./${sheet.name}`));
  console.log(data.pages, data.pages.length, data.pages[0]);
  const text = data.pages[0].split('\n');
  const name = text[0];
  const classAndLevel = text[2]; // double check how multiclass looks like here
  const background = text[4];
  const race = text[6];
  const alignment = text[8];
  const XP = text[10];
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
  let totalHP = '';
  if (!Number.isNaN(firstDigit)) {
    totalHP += firstDigit;
  }
  if (!Number.isNaN(secondDigit)) {
    totalHP += secondDigit;
  }
  // have this object look exactly like what a document would look like in the db for easier uploading. Look at parse html for reference
  const values = classAndLevel.split(',');
  const classes = [];
  if (values.length > 1) {
    for (let i = 0; i < values.length; i++) {
      classes.push({ name: values[i].substring(0, values[i].length - 1).trim(), level: values[i][values[i].length - 1] })
    }
  } else {
    classes.push({ name: values[0].substring(0, values[0].length - 1).trim(), level: values[0][values[0].length - 1] });
  }
  const isMulticlass = classes.length > 1 ? true : false;
  await fs.unlink(`./${sheet.name}`);
  return { 
    name,
    classes,
    background,
    race,
    alignment,
    XP,
    stats: {
      strength: {
        modifier: strengthModifier,
        score: strengthScore
      },
      dexterity: {
        modifier: dexMod,
        score: dexScore
      },
      constitution: {
        modifier: conMod,
        score: conScore
      },
      intelligence: {
        modifier: intMod,
        score: intScore
      },
      wisdom: {
        modifier: wisMod,
        score: wisScore
      },
      charisma: {
        modifier: charismaMod,
        score: charismaScore
      }
    },
    totalHP,
    isMulticlass
  };
};