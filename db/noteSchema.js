const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: String,
  text: String,
  noteCreator: {
    discordId: String,
    discordName: String,
    mongoId: mongoose.Schema.Types.ObjectId
  },
  image: String, // stores the discord attachment link
  file: String, // a txt file or similar if they can't contain the note to a document
  usersHaveAccess: [String],
  rolesHaveAccess: [String],
  guildId: String,
  tags: [String],
  noteId: String // a way to give a unique ID to each note. discordName + number note
}, { timestamps: true });

module.exports = noteSchema;