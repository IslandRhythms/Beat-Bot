'use strict';

const countries = require('../../resources/countryNamesAndCodes.json');
module.exports = async function countryOfTheDay() {
  console.log('getting country of the day ...')
  try {
    const index = Math.floor(Math.random() * countries.length);
    const selectedCountry = countries[index];
    const countryOTD = selectedCountry.commonName;
    const emojiName = selectedCountry.cca2.toLowerCase();
  
    return { countryOTD, countryEmojiFlag: `:flag_${emojiName}:` };
  } catch (error) {
    console.log('something went wrong with country of the day', error);
  }
}