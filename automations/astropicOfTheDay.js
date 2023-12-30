const axios = require('axios');

module.exports = async function astropicOfTheDay(db) {
  
  const res = await axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY').then(res => res.data);
  const { Daily } = db.models;
  const doc = await Daily.findOne();
  await doc.save();
};