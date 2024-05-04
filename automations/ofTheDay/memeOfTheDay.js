const axios = require('axios');

module.exports = async function memeOfTheDay() {
  console.log('getting meme of the day ...')
  const { data } = await axios.get('https://api.imgflip.com/get_memes').then(res => res.data);
  const randomMemeIndex = Math.floor(Math.random() * data.memes.length);
  const meme = data.memes[randomMemeIndex];
  return { memeOTD: meme.url }
};