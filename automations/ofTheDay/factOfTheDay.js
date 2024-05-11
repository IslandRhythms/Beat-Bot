'use strict';
const axios = require('axios');

module.exports = async function factOfTheDay() {
  console.log('getting fact of the day');
  try {
    const res = await axios.get('https://uselessfacts.jsph.pl/api/v2/facts/today').then(res => res.data);
    return { factOTD: { fact: res.text, source: res.source_url } };
  } catch (error) {
    console.log('something went wrong with fact of the day', error);
  }
}