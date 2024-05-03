'use strict';
const axios = require('axios');

module.exports = async function factOfTheDay(db) {
  
  const res = await axios.get('https://uselessfacts.jsph.pl/api/v2/facts/today').then(res => res.data);
  return { factOTD: { fact: res.text, source: res.source_url } };
}