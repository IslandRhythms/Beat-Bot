'use strict';

module.exports = async function sendMessageToTest(bot, message) {
  bot.guilds.cache.forEach(guild => {
    const testChannel = guild.channels.cache.find(x => x.name == 'bot-testing')
    if (testChannel) {
      const channel = bot.channels.cache.get(testChannel);
      channel.send(message)
    } else {
      console.log(`No test text channel found for guild "${guild.name}"`);
    }
  });
}