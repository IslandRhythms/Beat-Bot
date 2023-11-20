const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: String,
  text: String,
  noteCreator: mongoose.Schema.Types.ObjectId,
  hasAccess: [mongoose.Schema.Types.ObjectId],
}, { timestamps: true });

module.exports = noteSchema;