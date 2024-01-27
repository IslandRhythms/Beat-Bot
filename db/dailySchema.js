const mongoose = require('mongoose');

const dailySchema = new mongoose.Schema({
  wordOTD: String,
  animalOTD: {
    name: String,
    image: String,
    link: String,
    summary: String
  },
  pokemonOTD: String,
  factOTD: String,
  memeOTD: String,
  jokeOTD: String,
  plantOTD: String,
  astropicOTD: String,
  phaseOfTheMoon: String,
  songOTD: String,
  dateString: String, // MM/DD/YYYY
  pings: Number,
});

module.exports = dailySchema;