'use strict';
const wikipedia = require('wikipedia');

module.exports = async function happyBirthday(db, bot) {
  const { User } = db.models;

  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1; // Months are zero-based, so add 1
  const todayDay = today.getDate();

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
  users.forEach(user => {
    const birthYear = user.birthday.getFullYear();
    const age = todayYear - birthYear;
    console.log(`Happy birthday, ${user.name}! You are now ${age} years old.`);
  });

  const events = await wikipedia.onThisDay();
  const choices = Object.keys(events);
  const index = Math.floor(Math.random() * choices.length);
  const selectedArray = events[choices[index]];
  const onThisDayIndex = Math.floor(Math.random() * selectedArray.length);
  const pageEntry = selectedArray[onThisDayIndex].pages[0];
  const history = `For ${choices[index]} on this day, ${selectedArray[onThisDayIndex].year ? `in the year ${selectedArray[onThisDayIndex].year},` : ''} ${selectedArray[onThisDayIndex].text}
  link: ${pageEntry.content_urls.mobile.page}`;
  // send message into channel here / maybe send a DM?
}