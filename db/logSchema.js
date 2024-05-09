const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  message: String,
  commandName: String,
  commandArgs: 'Mixed',
  data: 'Mixed'
}, { timestamps: true });

module.exports = logSchema;