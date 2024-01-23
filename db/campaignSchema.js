const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title: String,
  groupName: String, // may not be the same as the title
  groupLogo: String,
  description: String,
  system: String, // D&D, Pathfinder, etc.
  guildId: String,
  gameMaster: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  partyLoot: [{ name: String, url: String }],
  tags: [String],
}, { timestamps: true });

module.exports = campaignSchema;