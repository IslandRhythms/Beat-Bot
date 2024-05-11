'use strict';
const axios = require('axios');

module.exports = async function numberOfTheDay() {
  console.log('getting number of the day ...')

  try {
    const res = await axios.get('http://numbersapi.com/random/trivia?json').then(res => res.data); // gets number and trivia fact
    return { numberOTD: res.number };
  } catch (error) {
    console.log('something went wrong with number of the day', error);
  }

};