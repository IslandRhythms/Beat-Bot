const axios = require('axios');

module.exports = async function pokemonOfTheDay(db) {
  
  const res = await axios.get('https://pokeapi.co/api/v2/pokemon-species/?limit=0').then(res => res.data); // get the total number of available pokemon to pull from
  await axios.get(`https://pokeapi.co/api/v2/pokemon/${res}`).then(res => res.data);
  
  const { Daily } = db.models;
  const doc = await Daily.findOne();
  // doc.pokemonOTD = wordOfTheDay;
  await doc.save();
};