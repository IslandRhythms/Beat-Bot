'use strict';
const { sendMessageToGeneral } = require('../helpers/sendMessageTo');

module.exports = function september(bot) {
  try {
    const youtube = `https://www.youtube.com/watch?v=Gs069dndIYk`;
    sendMessageToGeneral(bot, youtube)
  } catch (error) {
    console.log('something went wrong with earth wind and fire')
  }
}