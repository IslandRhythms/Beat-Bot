const axios = require('axios');

module.exports = async function numberOfTheDay() {
  
  const res = await axios.get('http://numbersapi.com/random/trivia?json').then(res => res.data); // gets number and trivia fact
  const numberOTD = { number: res.number, trivia: res.text };
  const more = await axios.get(`http://numbersapi.com/${res.number}/math?json`).then(res => res.data); // gets math fact about number
  numberOTD.mathFact = more.text;
  return { numberOTD };
};