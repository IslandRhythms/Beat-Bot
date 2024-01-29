const mongoose = require('mongoose');

const gameProfileSchema = new mongoose.Schema({
  campaigns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' }],
  numCampaigns: Number,
  player: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  overallPlayerLevel: Number, // sum of each characters player level.
  playerDescription: String, // a small intro for dms to get to know you.
  playerExpectations: String, // what the player expects from the game.
  playerCharacters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Character' }],
  numPlayerCharacters: Number,
  dmCampaigns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' }],
  numDMCampaigns: Number,
  campaignPreference: String, // In person, online
  campaignStyle: String, // Gritty, Casual, play test, combat driven, story driven, etc.
  availableToDm: Boolean,
  homebrewAllowed: Boolean,
  gmDescription: String, // a small intro for players to get to know you.
  gmExpectations: String, // what the gm expects from the players.
  guildId: String,
  preferredSystem: [String],
  tags: [String],
}, { timestamps: true });

module.exports = gameProfileSchema;