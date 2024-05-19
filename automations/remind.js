'use strict';

module.exports = async function remind(bot, params) {
  console.log('remind automation', params, bot);
  try {
    await bot.users.send(params.discordId, `Hello, this is Beat Bot reminding you about ${params.message}. You set this reminder on ${params.reminderSetOn}`);
    console.log('Reminder sent successfully');
  } catch (error) {
    console.log('something is not working', error);
    throw error; // Ensure the error is propagated
  }
};