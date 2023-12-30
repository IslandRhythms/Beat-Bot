const axios = require('axios');

module.exports = async function poemOfTheDay(db) {
  
  const res = await axios.get('https://poetrydb.org/random').then(res => res.data);
  const { Daily } = db.models;
  const doc = await Daily.findOne();
  await doc.save();
};