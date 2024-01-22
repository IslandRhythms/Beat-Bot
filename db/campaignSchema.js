const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title: String,
  description: String,
  system: String, // D&D, Pathfinder, etc.
  guildId: String,
  gameMaster: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  characters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GameProfile' }], // this is flawed
  partyLoot: [String],
  tags: [String],
}, { timestamps: true });

module.exports = campaignSchema;