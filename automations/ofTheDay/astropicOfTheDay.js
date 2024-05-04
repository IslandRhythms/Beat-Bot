'use strict';
const axios = require('axios');

module.exports = async function astropicOfTheDay(db) {
  console.log('getting astropic of the day ...')
  const res = await axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY').then(res => res.data);
  return { astropicOTD: { url: res.hdurl, title: res.title, description: res.explanation } };
};