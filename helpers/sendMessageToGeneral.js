'use strict';

module.exports = async function sendMessageToGeneral(bot, message) {
  bot.guilds.cache.forEach(guild => {
    const defaultChannel = guild.systemChannelId;
    if (defaultChannel) {
      console.log(`Default channel ID for guild "${guild.name}":`, defaultChannel.id);
      const channel = bot.channels.cache.get(defaultChannel);
      channel.send(message)
    } else {
      console.log(`No default text channel found for guild "${guild.name}"`);
    }
  });
}