'use strict';

const mongoose = require('mongoose');
require('../config');

const noteSchema = require('./noteSchema');
const pollSchema = require('./pollSchema');
const userSchema = require('./userSchema');
const errorSchema = require('./errorSchema');

module.exports = function models() {
  const connection = mongoose.createConnection(process.env.MONGODB_CONNECTION_STRING, {
    serverSelectionTimeoutMS: 30000
  });
  connection.model('Note', noteSchema);
  connection.model('User', userSchema);
  connection.model('Error', errorSchema);
  connection.model('Poll', pollSchema);
  return connection;
}