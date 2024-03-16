'use strict';

const axios = require('axios');
require('../config');

module.exports = async function plantOfTheDay() {
  const url = `https://perenual.com/api/species-list?key=${process.env.PLANTAPIKEY}`;
};