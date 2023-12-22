const axios = require('axios');

module.exports = async function wordOfTheDay(db) {
  const res = await axios.get('https://www.dictionary.com/e/word-of-the-day/').then(res => res.data);
  const root = parser.parse(res);
  const element = root.querySelector('div.wotd-item div.otd-item-headword__word h1');
  const wordOfTheDay = element.textContent;
  const { Daily } = db.models;
  const doc = await Daily.findOne();
  doc.WOTD = wordOfTheDay;
  await doc.save();
};