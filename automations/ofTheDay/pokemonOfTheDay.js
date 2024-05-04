'use strict';
const axios = require('axios');


module.exports = async function pokemonOfTheDay() {
  console.log('getting pokemon of the day ...')
  const res = await axios.get('https://pokeapi.co/api/v2/pokemon-species/?limit=0').then(res => res.data); // get the total number of available pokemon to pull from
  const pokedexEntries = res.count;
  const index = Math.floor(Math.random() * pokedexEntries);
  const pokemon = await axios.get(`https://pokeapi.co/api/v2/pokemon/${index}`).then(res => res.data);
  const selectedPokemon = pokemon.name

  return { pokemonOTD: selectedPokemon }
};