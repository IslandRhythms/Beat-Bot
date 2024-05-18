'use strict';

module.exports = function remind(bot) {
  return function(params) {
    console.log('remind automation', params, bot);
    try{
      bot.users.send(params.discordId, `Hello, this is Beat Bot reminding you about ${params.message}. You set this reminder on ${params.reminderSetOn}`);
    } catch (error) {
      console.log('something is not working', error);
    }
  };
};