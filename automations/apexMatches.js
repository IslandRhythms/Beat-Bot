'use strict';

const { sendMessageToEsports, sendMessageToTest } = require('../helpers/sendMessageTo');

module.exports = function apexMatches(bot, params) {
  try{
    sendMessageToEsports(bot, { embeds: [params.embed]})
  } catch (error) {
    console.log('something is not working', error);
  }
};