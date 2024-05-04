'use strict';

const countries = require('../countryNamesAndCodes.json');
module.exports = async function countryOfTheDay() {
  const index = Math.floor(Math.random() * countries.length);
  const selectedCountry = countries[index];
  const countryOTD = selectedCountry.commonName;
  const emojiName = selectedCountry.cca2.toLowerCase();

  return { countryOTD, countryEmojiFlag: `:flag_${emojiName}:` };
}