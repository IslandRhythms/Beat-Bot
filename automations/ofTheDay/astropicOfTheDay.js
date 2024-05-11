'use strict';
const axios = require('axios');

module.exports = async function astropicOfTheDay() {
  console.log('getting astropic of the day ...')
  try {
    const res = await axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY').then(res => res.data);
    return { astropicOTD: { url: res.hdurl, title: res.title, description: res.explanation } };
  } catch(error) {
    console.log('something went wrong with astropic of the day', error);
  }
};