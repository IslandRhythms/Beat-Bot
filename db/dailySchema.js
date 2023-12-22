const mongoose = require('mongoose');

const dailySchema = new mongoose.Schema({
  WOTD: String,
  
});

module.exports = dailySchema;