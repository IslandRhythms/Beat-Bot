'use strict';

const mongoose = require('mongoose');
require('../config');

const initTasks = require('@mongoosejs/task');

const noteSchema = require('./noteSchema');
const pollSchema = require('./pollSchema');
const userSchema = require('./userSchema');
const errorSchema = require('./errorSchema');
const dailySchema = require('./dailySchema');
const campaignSchema = require('./campaignSchema');
const gameProfileSchema = require('./gameProfileSchema');
const characterSchema = require('./characterSchema');
const bugReportSchema = require('./bugReportSchema');
const adventureSchema = require('./adventureSchema');

module.exports = function models() {
  const connection = mongoose.createConnection(process.env.MONGODB_CONNECTION_STRING, {
    serverSelectionTimeoutMS: 30000
  });

  initTasks(null, connection);
  connection.model('Note', noteSchema);
  connection.model('User', userSchema);
  connection.model('Error', errorSchema);
  connection.model('Poll', pollSchema);
  connection.model('Daily', dailySchema);
  connection.model('Campaign', campaignSchema);
  connection.model('GameProfile', gameProfileSchema);
  connection.model('Character', characterSchema);
  connection.model('BugReport', bugReportSchema);
  connection.model('Adventure', adventureSchema);
  return connection;
}