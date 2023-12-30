const axios = require('axios');

module.exports = async function factOfTheDay(db) {
  
  const res = await axios.get('https://uselessfacts.jsph.pl/api/v2/facts/today').then(res => res.data);
  // res.text
  const { Daily } = db.models;
  const doc = await Daily.findOne();
  await doc.save();
};