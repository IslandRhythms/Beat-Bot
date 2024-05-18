'use strict';

const axios = require('axios');
require('../../config');

module.exports = async function plantOfTheDay() {
  console.log('Getting plant information ...');
  try {
    // api allows access to max 3000
    const plantOfTheDayId = Math.floor(Math.random() * 3000) + 1; // no id 0
    const plantInformation = await axios.get(`https://perenual.com/api/species/details/${plantOfTheDayId}?key=${process.env.PLANTAPIKEY}`).then(res => res.data).catch(e => console.log(e.message));
    return { plantInformation };
  } catch (error) {
    console.log('something went wrong with plant of the day', error);
  }
};