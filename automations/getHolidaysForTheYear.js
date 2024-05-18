'use strict';

const axios = require('axios');
const fs = require('fs/promises');
const events = require('../resources/Events.json');

module.exports = async function getHolidaysForTheYear() {
  try {
    const res = await axios.get(`https://date.nager.at/api/v3/PublicHolidays/2024/US`).then(res => res.data);
    const fixedHolidays = res.map(x => ({ date: new Date(x.date).toISOString(), name: x.name }))
    const year = new Date().getFullYear();
    for (let i = 0; i < events.length; i++) {
      events[i].date = new Date(`${year}-${events[i].date}`).toISOString();
    }
    const thanksgiving = fixedHolidays.find(x => x.name == 'Thanksgiving Day');
    const thanksDate = new Date(thanksgiving.date);
    const blackFriday = new Date(thanksDate.setDate(thanksDate.getDate() + 1));
    events.push({ name: 'Black Friday', date: blackFriday.toISOString()})
    const holidays = fixedHolidays.concat(events).sort(function(a,b) {
      if (a.date < b.date) {
        return -1;
      } else {
        return 1;
      }
    })
    await fs.writeFile(`./resources/holidays.json`, JSON.stringify(holidays, null, 2));
  } catch (error) {
    console.log('something went wrong while getting the holidays for the year', error)
  }
}