const axios = require('axios');

module.exports = async function poemOfTheDay() {
  
  const res = await axios.get('https://poetrydb.org/random').then(res => res.data);
  return { poemOfTheDay: res }
};