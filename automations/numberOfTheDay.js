'use strict';
const axios = require('axios');

module.exports = async function numberOfTheDay() {
  const res = await axios.get('http://numbersapi.com/random/trivia?json').then(res => res.data); // gets number and trivia fact
  return { numberOTD: res.number };
};