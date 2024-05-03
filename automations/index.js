
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
  const obj = {};
  const fields = [];
  const { WOTD } = await wordOfTheDay();
  obj.wordOTD = WOTD;
  fields.push({ name: 'Word of the Day', value: WOTD });
  const { pokemonOTD } = await pokeOfTheDay();
  obj.pokemonOTD = pokemonOTD;
  fields.push({ name: 'Pokemon of the Day', value: pokemonOTD });
  const { phaseOfTheMoon } = await moonPhase();
  obj.phaseOfTheMoon = phaseOfTheMoon;
  fields.push({ name: 'Moon Phase Today', value: `${phaseOfTheMoon.icon} ${phaseOfTheMoon.phase} ${phaseOfTheMoon.moon} ${phaseOfTheMoon.icon}`});
  const { poemOfTheDay } = await poetryOfTheDay();
  obj.poemOTD = poemOfTheDay;
  fields.push({ name: 'Poem of the Day', value: poemOfTheDay });
  const { numberOTD } = await numberOfTheDay();
  obj.numberOTD = numberOTD;
  fields.push({ name: 'Number of the Day', value: numberOTD });
  const { jokeOTD } = await jokeOfTheDay();
  if (jokeOTD.setup) {
    obj.jokeOTD.setup = jokeOTD.setup;
    obj.jokeOTD.delivery = jokeOTD.delivery;
    fields.push({ name: 'Joke of the Day', value: `${jokeOTD.setup} || ${jokeOTD.delivery} ||` });
  } else {
    obj.jokeOTD.joke = jokeOTD.joke;
    fields.push({ name: 'Joke of the Day', value: `|| ${jokeOTD.joke} ||` });
  }
  const { factOTD } = await factOfTheDay();
  obj.factOTD.fact = factOTD.fact;
  obj.factOTD.source = factOTD.source;
  fields.push({ name: 'Fact of the Day', value: `${factOTD.fact} Source: ${factOTD.source}` });
  const { memeOTD } = await memeOfTheDay();
  obj.memeOTD = memeOTD;
  fields.push({ name: 'Meme of the Day', value: memeOTD });
  const { astropicOTD } = await astropicOfTheDay();
  obj.astropicOTD.url = astropicOTD.url;
  obj.astropicOTD.title = astropicOTD.title;
  obj.astropicOTD.description = astropicOTD.description;
  fields.push({ name: 'Astronomy Picture of the Day', value: `${astropicOTD.title} ${astropicOTD.description} ${astropicOTD.url}`});
  const { AOTD } = await animalOfTheDay();
  obj.animalOTD.name = AOTD.name;
  obj.animalOTD.scientificName = AOTD.scientificName;
  obj.animalOTD.image = AOTD.image;
  obj.animalOTD.funFact = AOTD.funFact;
  obj.animalOTD.link = AOTD.link;
  obj.animalOTD.briefSummary = AOTD.briefSummary;
  fields.push({ name: 'Animal of the Day', value: AOTD.name });
  const { riddleOTD } = await riddleOfTheDay();
  obj.riddleOTD.riddle = riddleOTD.riddle;
  obj.riddleOTD.answer = riddleOTD.answer;
  fields.push({ name: 'Riddle of the Day', value: `${riddleOTD.riddle} || ${riddleOTD.answer} ||`});
  const sOTD = await songOfTheDay();
  obj.songOTD.name = sOTD.name;
  obj.songOTD.artist = sOTD.artist;
  obj.songOTD.url = sOTD.url;
  obj.songOTD.image = sOTD.image;
  obj.songOTD.genre = sOTD.genre;
  fields.push({ name: 'Song of the Day', value: `${sOTD.name} by ${sOTD.artist} ${sOTD.url}` });
  const artOTD = await artworkOfTheDay();
  obj.metTitle = artOTD.met.title;
  obj.metImageLink = artOTD.met.image;
  obj.metArtist = artOTD.met.artist;
  obj.chicagoTitle = artOTD.chicago.title;
  obj.chicagoImageLink = artOTD.chicago.image;
  obj.chicagoArtist = artOTD.chicago.artist;
  fields.push({ name: 'Artworks of the Day', value: `Met: ${artOTD.met.image} | Chicago: ${artOTD.chicago.image}`});
  const doc = await Daily.create(obj);
  const paginate = new Pagination();
  paginate.ready();

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
