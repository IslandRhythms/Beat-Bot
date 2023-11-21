const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: String,
  text: String,
  noteCreator: mongoose.Schema.Types.ObjectId,
  usersHaveAccess: [mongoose.Schema.Types.ObjectId],
  rolesHaveAccess: [String],
  guildId: String
}, { timestamps: true });

module.exports = noteSchema;