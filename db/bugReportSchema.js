const mongoose = require('mongoose');

const bugReportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  stepsToReproduce: {
    type: [String],
  },
  pic: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Confirmed', 'Expected', 'Fixed', 'Third Party Problem', 'Feature Request']
  },
  bugId: {
    type: String,
    required: true
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = bugReportSchema;