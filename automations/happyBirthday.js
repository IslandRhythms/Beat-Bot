'use strict';

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
  // send message into channel here / maybe send a DM?
}