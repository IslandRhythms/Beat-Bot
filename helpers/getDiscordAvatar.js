'use strict';

module.exports = function getDiscordAvatar(user) {
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
}