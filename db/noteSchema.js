const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: String,
  text: String,
  noteCreator: {
    discordId: String,
    mongoID: mongoose.Schema.Types.ObjectId
  },
  usersHaveAccess: [String],
  rolesHaveAccess: [String],
  guildId: String
}, { timestamps: true });

module.exports = noteSchema;