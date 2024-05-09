'use strict';

exports.sendMessageToGeneral = function(bot, message) {
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

exports.sendMessageToOwner = function(bot, message) {
  const owner = bot.application.owner.id;
  bot.users.send(owner, message);
}

exports.sendMessageToTest = function(bot, message) {
  bot.guilds.cache.forEach(guild => {
    const testChannel = guild.channels.cache.find(x => x.name == 'bot-testing')
    if (testChannel) {
      const channel = bot.channels.cache.get(testChannel.id);
      channel.send(message)
    } else {
      console.log(`No test text channel found for guild "${guild.name}"`);
    }
  });
}