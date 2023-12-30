const axios = require('axios');

module.exports = async function jokeOfTheDay(db) {
  
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
  // check type and depending on type, single or twopart, format differently
  const { Daily } = db.models;
  const doc = await Daily.findOne();
  await doc.save();
};