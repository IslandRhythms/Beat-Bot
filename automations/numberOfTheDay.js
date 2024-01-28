const axios = require('axios');

module.exports = async function numberOfTheDay(db) {
  
  const res = await axios.get('http://numbersapi.com/random/trivia?json').then(res => res.data); // gets number and trivia fact
  const more = await axios.get(`http://numbersapi.com/${res.number}/math?json`).then(res => res.data); // gets math fact about number
  const { Daily } = db.models;
  const doc = await Daily.findOne();
  await doc.save();
};