const mongoose = require('mongoose');

const gameProfileSchema = new mongoose.Schema({
  campaigns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' }],
  numCampaigns: {
    type: Number,
    default: 0,
    get: v => v.toString()
  },
  player: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  overallPlayerLevel: { // sum of each characters player level.
    type: Number,
    default: 0,
    get: v => v.toString()
  },
  playerDescription: {  // a small intro for dms to get to know you.
    type: String,
    default: '' 
  },
  playerExpectations: { // what the player expects from the game.
    type: String,
    default: ''
  },
  playerCharacters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Character' }],
  numPlayerCharacters: Number,
  dmCampaigns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' }],
  numDMCampaigns: {
    type: Number,
    default: 0,
    get: v => v.toString()
  },
  campaignPreference: { // In person, online
    type: String,
    default: ''
  },
  campaignStyle: { // Gritty, Casual, play test, combat driven, story driven, etc.
    type: String,
    default: ''
  },
  availableToDm: {
    type: Boolean,
    default: false,
    get: v => v.toString()
  },
  homebrewAllowed: {
    type: Boolean,
    default: false,
    get: v => v.toString()
  },
  gmDescription: { // a small intro for players to get to know you.
    type: String,
    default: '',
  },
  gmExpectations: { // what the gm expects from the players.
    type: String,
    default: ''
  },
  guildId: String,
  preferredSystem: [String],
  tags: [String],
}, { timestamps: true });

module.exports = gameProfileSchema;