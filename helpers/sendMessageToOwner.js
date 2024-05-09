'use strict';

module.exports = async function sendMessageToTest(bot, message) {
  const owner = bot.application.owner.id;
  bot.users.send(owner, message);
}