const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
  player: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  playerProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'GameProfile' },
  system: String, // what system was the character played in? Ex: D&D, Pathfinder, etc.
  guildId: String,
  characterId: String, // another way to find a character.
  isAlive: Boolean,
  causeOfDeath: String,
  isRetired: Boolean, // player was done with character and wanted new character but this character did not die.
  isFavorite: Boolean,
  isHero: Boolean, // completed the campaign with this character
  name: String,
  totalLevel: Number,
  race: String,
  background: String,
  isMulticlass: Boolean,
  classes: [{ name: String, level: { type: Number, get: v => v.toString() } }],
  feats: [{ name: String, ASI: { stat: String, amount: Number } }],
  epilogue: String,
  alignment: String,
  backStory: String,
  equipment: [{ name: String, amount: Number }],
  groupName: String,
  characterImage: String,
  trait: String,
  ideal: String,
  bond: String,
  flaw: String,
  totalHP: String,
  XP: String,
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
});

module.exports = characterSchema;