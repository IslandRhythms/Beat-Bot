'use strict';
const wikipedia = require('wikipedia');
// could also use http://numbersapi.com/#1/28/date instead of wikipedia

module.exports = async function onThisDay() {
  console.log('getting what happened on this day ...')
  try {
    const events = await wikipedia.onThisDay();
    const choices = Object.keys(events);
    const index = Math.floor(Math.random() * choices.length);
    const selectedArray = events[choices[index]];
    const onThisDayIndex = Math.floor(Math.random() * selectedArray.length);
    const pageEntry = selectedArray[onThisDayIndex].pages[0];
    const history = `For ${choices[index]} on this day, ${selectedArray[onThisDayIndex].year ? `in the year ${selectedArray[onThisDayIndex].year},` : ''} ${selectedArray[onThisDayIndex].text}
    link: ${pageEntry.content_urls.mobile.page}`;
    return { historyOTD: history };
  } catch (error) {
    console.log('something went wrong with on this day', error);
  }
}