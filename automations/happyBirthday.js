'use strict';
const wikipedia = require('wikipedia');
const sendMessageToGeneral = require('../helpers/sendMessageToGeneral');
const { EmbedBuilder } = require('discord.js');

module.exports = async function happyBirthday(db, bot) {
  const { User, Log } = db.models;
  try {
    const today = new Date();
    const todayYear = today.getUTCFullYear();
    const todayMonth = today.getUTCMonth() + 1; // Months are zero-based, so add 1
    const todayDay = today.getUTCDate();
  
    const users = await User.find({
      $expr: {
        $and: [
          { $eq: [{ $month: '$birthday' }, todayMonth] },
          { $eq: [{ $dayOfMonth: '$birthday' }, todayDay] },
        ],
      },
    });
    if (users.length == 0) {
      return;
    }
  
    const embed = new EmbedBuilder().setTitle(`Happy Birthday to the Following Users!`);
    const zodiac = users.find(x => typeof x.zodiac != 'string');
    users.forEach(user => {
      if (typeof user.birthday == 'string') {
        return;
      }
      const birthYear = user.birthday.getUTCFullYear();
      const age = todayYear - birthYear;
      embed.addFields({ name: `${user.discordName}`, value: `${age}`, inline: true });
    });
  
    const events = await wikipedia.onThisDay();
    const choices = Object.keys(events);
    const index = Math.floor(Math.random() * choices.length);
    const selectedArray = events[choices[index]];
    const onThisDayIndex = Math.floor(Math.random() * selectedArray.length);
    const pageEntry = selectedArray[onThisDayIndex].pages[0];
    const history = `For ${choices[index]} on this day, ${selectedArray[onThisDayIndex].year ? `in the year ${selectedArray[onThisDayIndex].year},` : ''} ${selectedArray[onThisDayIndex].text}
    link: ${pageEntry.content_urls.mobile.page}`;
    embed.setDescription(`You were born in the year of the ${zodiac.name}. ${zodiac.description} You are most compatible with ${zodiac.compatible.join(', ')} and least compatible with ${zodiac.incompatible} ${history}`)
    // send message into channel here / maybe send a DM?
    sendMessageToGeneral(bot, { embeds: [embed] });
  } catch (error) {
    await Log.create({ message: error.message, commandName: `happyBirthdayAutomation`, data: error });
  }
}