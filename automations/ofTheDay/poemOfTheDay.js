'use strict';
const axios = require('axios');

module.exports = async function poemOfTheDay() {
  console.log('getting poem of the day ...')
  const maxLineCount = 15;
  const minLineCount = 1
  const selectedLineCount = Math.floor(Math.random() * maxLineCount) + minLineCount;
  const res = await axios.get(`https://poetrydb.org/linecount/${selectedLineCount}`).then(res => res.data);
  const selectedPoem = Math.floor(Math.random() * res.length);
  return { poemOfTheDay: { title: res[selectedPoem].title, author: res[selectedPoem].author } }
};