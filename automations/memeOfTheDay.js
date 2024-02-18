const axios = require('axios');

module.exports = async function memeOfTheDay() {
  const res = await axios.get('https://api.imgflip.com/get_memes').then(res => res.data);
  const randomMemeIndex = Math.floor(Math.random() * res.memes.length);
  const meme = res.memes[randomMemeIndex];
  return { memeOTD: meme.url }
};