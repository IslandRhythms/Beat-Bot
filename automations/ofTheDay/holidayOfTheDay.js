'use strict';
const holidays = require('../../resources/holidays.json');

module.exports = function holidayOfTheDay() {
  try {
    const today = new Date();
    const year = today.getUTCFullYear();
    const month = today.getUTCMonth() + 1;
    const day = today.getUTCDay();
    
    for (let i = 0; i < holidays.length; i++) {
      if (today == new Date(holidays[i].date)) {
        console.log('today', today, 'selected holiday', holidays[i])
          if (holidays[i].name == 'Christmas Day') {
            return 'Merry Christmas'
          } else {
            return `Happy ${holidays[i].name}`
          }
      }
    }
    return null;
  } catch (error) {
    console.log('something went wrong with holdiay of the day', error);
  }
}