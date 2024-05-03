'use strict';
const axios = require('axios');


module.exports = async function pokemonOfTheDay() {
  
  const res = await axios.get('https://pokeapi.co/api/v2/pokemon-species/?limit=0').then(res => res.data); // get the total number of available pokemon to pull from
  const pokedexEntries = res.count;
  const index = Math.floor(Math.random() * pokedexEntries);
  const selectedPokemon = res.results[index].name;

  return { pokemonOTD: selectedPokemon }
};