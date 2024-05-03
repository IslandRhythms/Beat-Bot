const axios = require('axios');

module.exports = async function jokeOfTheDay() {
  
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
    return { jokeOTD: { setup: res.setup, delivery: res.delivery } };
  } else {
    return { jokeOTD: { joke: res.joke } };
  }
};