'use strict';

const { sendMessageToEsports, sendMessageToTest } = require('../helpers/sendMessageTo');

module.exports = function apexMatches(bot) {
  return function(params) {
    console.log('apex matches automation', params, bot);
    try{
      sendMessageToEsports(bot, { embeds: [params.embed]})
    } catch (error) {
      console.log('something is not working', error);
    }
  };
};