'use strict';

const mongoose = require('mongoose');
require('../config');

const noteSchema = require('./noteSchema');
const pollSchema = require('./pollSchema');
const userSchema = require('./userSchema');
const errorSchema = require('./errorSchema');
const dailySchema = require('./dailySchema');
const campaignSchema = require('./campaignSchema');
const gameProfileSchema = require('./gameProfileSchema');

module.exports = function models() {
  const connection = mongoose.createConnection(process.env.MONGODB_CONNECTION_STRING, {
    serverSelectionTimeoutMS: 30000
  });
  connection.model('Note', noteSchema);
  connection.model('User', userSchema);
  connection.model('Error', errorSchema);
  connection.model('Poll', pollSchema);
  connection.model('Daily', dailySchema);
  connection.model('Campaign', campaignSchema);
  connection.model('GameProfile', gameProfileSchema);
  return connection;
}