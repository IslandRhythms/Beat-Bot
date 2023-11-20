const mongoose = require('mongoose');

const errorSchema = new mongoose.Schema({
  message: String,
  data: 'Mixed'
}, { timestamps: true });

module.exports = errorSchema;