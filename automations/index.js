
const initTasks = require('@mongoosejs/task');
const { Pagination } = require('pagination.djs');

const onThisDay = require('./onThisDay');
const wordOfTheDay = require('./wordOfTheDay');
const pokeOfTheDay = require('./pokemonOfTheDay');
const poetryOfTheDay = require('./poemOfTheDay');
const moonPhase = require('./phaseOfTheMoon');
const numberOfTheDay = require('./numberOfTheDay');
const jokeOfTheDay = require('./jokeOfTheDay');
const factOfTheDay = require('./factOfTheDay');
const memeOfTheDay = require('./memeOfTheDay');
const astropicOfTheDay = require('./astropicOfTheDay');
const animalOfTheDay = require('./animalOfTheDay');
const songOfTheDay = require('./songOfTheDay');
const artworkOfTheDay = require('./artworkOfTheDay');
const riddleOfTheDay = require('./riddleOfTheDay');

const startQueue = require('./startQueue');

const millisecondsInDay = 86400000;
const millisecondsInWeek = 604800000;

// https://discordjs.guide/popular-topics/faq.html#how-do-i-send-a-message-to-a-specific-channel
// gonna need to pass the discord client for some of these automations
module.exports = async function tasks(db) {
  const { Task } = db.models;
  initTasks(null, db);
  Task.registerHandler('ofTheDay', ofTheDay(db));
  await Task.startPolling();
  await Task.findOneAndUpdate({ name: 'ofTheDay', status: 'pending' }, { scheduledAt: next6am, repeatAfterMS: millisecondsInDay }, { upsert: true, returnDocument: 'after' });
}
// use pagination so that each entry can have their own embed
// https://pagination-djs.js.org/#md:other-send-options
async function ofTheDay(db) {
  const { Daily } = db.models;
  const obj = { };
  const { WOTD } = await wordOfTheDay();
  const { pokemonOfTheDay } = await pokeOfTheDay(); // copy more or less what we do for the fun command
  const { phaseOfTheMoon } = await moonPhase();
  const { poemOfTheDay } = await poetryOfTheDay();
  const { numberOTD } = await numberOfTheDay();
  const { jokeOTD } = await jokeOfTheDay();
  const { factOTD } = await factOfTheDay();
  const { memeOTD } = await memeOfTheDay();
  const { astropicOTD } = await astropicOfTheDay();
  const { AOTD } = await animalOfTheDay();
  const { riddleOTD } = await riddleOfTheDay();
  const sOTD = await songOfTheDay();
  const artOTD = await artworkOfTheDay();
  obj.metTitle = artOTD.met.title;
  obj.metImageLink = artOTD.met.image;
  obj.metArtist = artOTD.met.artist;
  obj.chicagoTitle = artOTD.chicago.title;
  obj.chicagoImageLink = artOTD.chicago.image;
  obj.chicagoArtist = artOTD.chicago.artist;
  const doc = await Daily.create();
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
