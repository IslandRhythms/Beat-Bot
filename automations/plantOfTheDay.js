'use strict';

const axios = require('axios');
require('../config');

// figure out what information we want in the embed and where
module.exports = async function plantOfTheDay() {
  console.log('Getting plant information ...');
  // api allows access to max 3000
  const plantOfTheDayId = Math.floor(Math.random() * 3000) + 1; // no id 0
  const plantInformation = await axios.get(`https://perenual.com/api/species/details/${plantOfTheDayId}?key=${process.env.PLANTAPIKEY}`).then(res => res.data).catch(e => console.log(e.message));
  console.log(plantInformation);
  return { plantInformation };
};