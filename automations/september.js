'use strict';
const sendMessageToGeneral = require('../helpers/sendMessageToGeneral');

module.exports = function september(bot) {
  const youtube = `https://www.youtube.com/watch?v=Gs069dndIYk`;
  sendMessageToGeneral(bot, youtube)
}