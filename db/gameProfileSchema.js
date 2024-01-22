const mongoose = require('mongoose');

const gameProfileSchema = new mongoose.Schema({
  campaigns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' }],
  numCampaigns: Number,
  player: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  overallPlayerLevel: Number, // sum of each characters player level.
  playerCharacters: [{ 
    campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
    isAlive: Boolean,
    name: String,
    totalLevel: Number,
    race: String,
    background: String,
    isMulticlass: Boolean,
    classes: [String],
    epilogue: String,
    backStory: String,
    equipment: [String],
    groupName: String,
    characterImage: String,
    stats: {
      strength: {
        modifier: Number,
        score: Number
      },
      dexterity: {
        modifier: Number,
        score: Number
      },
      constitution: {
        modifier: Number,
        score: Number
      },
      intelligence: {
        modifier: Number,
        score: Number
      },
      wisdom: {
        modifier: Number,
        score: Number
      },
      charisma: {
        modifier: Number,
        score: Number
      }
    }
  }],
  numPlayerCharacters: Number,
  dmCampaigns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' }],
  numDMCampaigns: Number,
  guildId: String,
  tags: [String],
}, { timestamps: true });

module.exports = gameProfileSchema;