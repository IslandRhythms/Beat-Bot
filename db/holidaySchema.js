const mongoose = require('mongoose');

const holidaySchema = new mongoose.Schema({
  name: String,
  date: String,
  type: { type: String}
});

module.exports = holidaySchema;