const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title: String,
  groupName: String, // may not be the same as the title
  groupLogo: String,
  description: String,
  system: String, // D&D, Pathfinder, etc.
  guildId: String,
  meetingAt: String, // When the players and GM get together to play.
  isVictory: Boolean, // did the players win?
  isStale: Boolean, // did everyone just lose interest
  gameMaster: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  characters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Character' }],
  partyLoot: [{ name: String, url: String, checkedOut: Boolean, lost: Boolean, character: { type: mongoose.Schema.Types.ObjectId, ref: 'Character'} }],
  tags: [String],
  numEncounters: Number,
  campaignId: {
    type: String, // an easy to remember campaignId
    required: true
  }
}, { timestamps: true });

module.exports = campaignSchema;