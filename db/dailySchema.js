const mongoose = require('mongoose');

const dailySchema = new mongoose.Schema({
  wordOTD: String,
  animalOTD: {
    name: String,
    scientificName: String,
    image: String,
    funFact: String,
    link: String,
    briefSummary: String
  },
  artOTD: {
    metTitle: String,
    metImageLink: String,
    metArtist: String,
    chicagoTitle: String,
    chicagoImageLink: String,
    chicagoArtist: String
  },
  pokemonOTD: String,
  poemOTD: String,
  factOTD: { fact: String, source: String },
  memeOTD: String,
  jokeOTD: {
    setup: String,
    delivery: String,
    joke: String
  },
  plantOTD: String,
  astropicOTD: {
    url: String,
    title: String,
    description: String,
  },
  phaseOfTheMoon: {
    phase: String,
    moon: String,
    icon: String
  },
  songOTD: {
    name: String,
    artist: String,
    url: String,
    image: String
  },
  numberOTD: {
    number: Number,
    trivia: String,
    mathFact: String
  },
  countryOTD: String,
  dateString: String, // MM/DD/YYYY
  pings: Number, // how many times people have called the bot
  totalBugReports: Number
});

module.exports = dailySchema;