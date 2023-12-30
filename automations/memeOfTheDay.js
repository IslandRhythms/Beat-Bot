const axios = require('axios');

module.exports = async function memeOfTheDay(db) {
  
  const res = await axios.get('https://api.imgflip.com/get_memes').then(res => res.data);
  const { Daily } = db.models;
  const doc = await Daily.findOne();
  await doc.save();
};