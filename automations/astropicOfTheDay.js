const axios = require('axios');

module.exports = async function astropicOfTheDay(db) {
  
  const res = await axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY').then(res => res.data);
  return { astropicOTD: { url: res.hdurl, title: res.title, description: res.explanation } };
};