const axios = require('axios');
const parser = require('node-html-parser');

module.exports = async function wordOfTheDay() {
  console.log('getting word of the day ...')
  try {
    const res = await axios.get('https://www.dictionary.com/e/word-of-the-day/').then(res => res.data);
    const root = parser.parse(res);
    const element = root.querySelector('div.wotd-item div.otd-item-headword__word h1');
    const wordOfTheDay = element.textContent;
    return { WOTD: wordOfTheDay }
  } catch (error) {
    console.log('something went wrong with word of the day', error);
  }
};