'use strict';
const axios = require('axios');

module.exports = async function riddle() {
  console.log('getting riddle of the day ...')
  const res = await axios.get('https://riddles-api.vercel.app/random').then(res => res.data);
  return { riddleOTD: { riddle: res.riddle, answer: res.answer } };
};