'use strict';
const axios = require('axios');

module.exports = async function jokeOfTheDay() {
  console.log('getting joke of the day')
  try {
    let url = null;
    const today = new Date();
    if (today.getMonth() == 9) { // October
      url = 'https://v2.jokeapi.dev/joke/Spooky';
    } else if (today.getMonth() == 11) { // December
      url = 'https://v2.jokeapi.dev/joke/Christmas';
    } else {
      url = 'https://v2.jokeapi.dev/joke/Programming,Miscellaneous,Dark,Pun';
    }
    const res = await axios.get(url).then(res => res.data);
    if (res.error) {
      return { jokeOTD: { joke: 'something went wrong'} };
    }
    if (res.type == 'twopart') {
      return { jokeOTD: { setup: res.setup, delivery: res.delivery, safe: res.safe } };
    } else {
      return { jokeOTD: { joke: res.joke, safe: res.safe } };
    }
  } catch (error) {
    console.log('something went wrong with joke of the day', error);
  }
};