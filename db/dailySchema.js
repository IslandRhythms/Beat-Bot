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
  bookOTD: {
    title: String,
    bookRoute: String,
    ISBNX: String,
    ISBN13: String,
    OCLC: String
  },
  plantOTD: {
    name: String,
    id: Number
  },
  pokemonOTD: {
    type: String
  },
  poemOTD: {
    title: String,
    author: String
  },
  factOTD: { fact: String, source: String },
  memeOTD: {
    url: String,
    NSFW: Boolean,
    title: String,
    postLink: String
  },
  jokeOTD: {
    setup: String,
    delivery: String,
    joke: String
  },
  plantOTD: {
    name: String,
    id: String
  },
  puzzleOTD: {
    type: String
  },
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
    image: String,
    genre: String
  },
  numberOTD: {
    type: Number
  },
  riddleOTD: {
    riddle: String,
    answer: String
  },
  historyOTD: {
    type: String
  },
  countryOTD: String,
  holidayOTD: String,
  dateString: String, // MM/DD/YYYY
  pings: [{
    name: String,
    called: Number
  }],
  totalBugReports: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = dailySchema;