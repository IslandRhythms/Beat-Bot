'use strict';

module.exports = function remind(params, bot) {
  bot.users.send(params.discordId, params.message)
}