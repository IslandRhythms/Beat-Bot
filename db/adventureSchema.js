const mongoose = require('mongoose');

const adventureSchema = new mongoose.Schema({
  title: String,
  designer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  description: String,
  url: String,
  document: String,
  picture: String
});

module.exports = adventureSchema;