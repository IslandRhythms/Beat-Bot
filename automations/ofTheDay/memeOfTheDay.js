'use strict';
const axios = require('axios');
// alternative https://github.com/D3vd/Meme_Api?tab=readme-ov-file
// alternative https://github.com/halitsever/random-memes

module.exports = async function memeOfTheDay() {
  console.log('getting meme of the day ...');
  try {
    const meme  = await axios.get('https://meme-api.com/gimme').then(res => res.data);
    return { memeOTD: { title: meme.title, NSFW: meme.nsfw, url: meme.url, postLink: meme.postLink } }
  } catch (error) {
    console.log('something went wrong with meme of the day', error);
    return { memeOTD: { title: null } }
  }
};