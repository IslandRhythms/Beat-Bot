
const initTasks = require('@mongoosejs/task');
const interestingFact = require('./interestingFact');
const onThisDay = require('./onThisDay');
const wordOfTheDay = require('./wordOfTheDay');
const startQueue = require('./startQueue');

const millisecondsInDay = 86400000;
const millisecondsInWeek = 604800000;

module.exports = async function tasks(db) {
  const { Task } = db.models;
  initTasks(null, db);
  /*
  Task.registerHandler('interestingFact', interestingFact(db));
  Task.registerHandler('onThisDay', onThisDay(db));
  Task.registerHandler('wordOfTheDay', wordOfTheDay(db));
  Task.registerHandler('startQueue', startQueue(db));
  await Task.startPolling();
  await Task.findOneAndUpdate({
    name: 'onThisDay',
    status: 'pending'
  },
  {
    scheduledAt: next6am,
    repeatAfterMS: millisecondsInDay
  },
  {
    upsert: true,
    returnDocument: 'after'
  });
  await Task.findOneAndUpdate({
    name: 'interestingFact',
    status: 'pending'
  },
  {
    scheduledAt: next6am,
    repeatAfterMS: millisecondsInDay
  },
  {
    upsert: true,
    returnDocument: 'after'
  });
  await Task.findOneAndUpdate({
    name: 'wordOfTheDay',
    status: 'pending'
  },
  {
    scheduledAt: next6am,
    repeatAfterMS: millisecondsInDay
  },
  {
    upsert: true,
    returnDocument: 'after'
  });

  await Task.findOneAndUpdate({
    name: 'startQueue',
    status: 'pending'
  }, {
    scheduledAt: getNextWeekAt6,
    repeatAfterMS: millisecondsInWeek
  }, {
    upsert: true,
    returnDocument: 'after'
  });
*/
}
function next6am() {
  const today = Date.now();
  if (today.getHours() < 6) {
    today.setHours(6);
    today.setMinutes(0);
    today.setSeconds(5); // add a buffer between starting the script and it getting to the task start.
    return today;
  }
  const tomorrow = Date.now();
  tomorrow.setDate(today.getDate() + 1);
  tomorrow.setHours(6);
  tomorrow.setMinutes(0);
  tomorrow.setSeconds(5); // add a buffer between starting the script and it getting to the task start.
  return tomorrow;
}

// https://codereview.stackexchange.com/questions/33527/find-next-occurring-friday-or-any-dayofweek
function getNextWeekAt6() {

}
