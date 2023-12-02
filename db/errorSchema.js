const mongoose = require('mongoose');

const errorSchema = new mongoose.Schema({
  message: String,
  commandName: String,
  commandArgs: 'Mixed',
  data: 'Mixed'
}, { timestamps: true });

module.exports = errorSchema;