const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: String,
  text: String,
  noteCreator: {
    discordId: String,
    mongoId: mongoose.Schema.Types.ObjectId
  },
  image: String, // stores the discord attachment link
  usersHaveAccess: [String],
  rolesHaveAccess: [String],
  guildId: String
}, { timestamps: true });

module.exports = noteSchema;