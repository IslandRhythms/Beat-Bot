'use strict';
const axios = require('axios');

module.exports = async function riddle() {
  console.log('getting riddle of the day ...')

  try {
    const res = await axios.get('https://riddles-api.vercel.app/random').then(res => res.data);
    return { riddleOTD: { riddle: res.riddle, answer: res.answer } };
  } catch (error) {
    console.log('something went wrong with riddle of the day', error);
  }
};