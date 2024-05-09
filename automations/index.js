'use strict';

const db = require('../db');
const initTasks = require('@mongoosejs/task');
const millisecondsInDay = 86400000;
const millisecondsInWeek = 604800000;
const millisecondsInYear = 31556952000;

const { EmbedBuilder } = require('discord.js');

const sendMessageTo = require('../helpers/sendMessageTo.js');

const getHolidaysForTheYear = require('./getHolidaysForTheYear.js');
const happyBirthday = require('./happyBirthday');
const remind = require('./remind');
const september = require('./september.js');
const startQueue = require('./startQueue');

// of the day daily automation
const animalOfTheDay = require('./ofTheDay/animalOfTheDay');
const artworkOfTheDay = require('./ofTheDay/artworkOfTheDay');
const astropicOfTheDay = require('./ofTheDay/astropicOfTheDay');
const bookOfTheDay = require('./ofTheDay/bookOfTheDay');
const countryOfTheDay = require('./ofTheDay/countryOfTheDay');
const factOfTheDay = require('./ofTheDay/factOfTheDay');
const holidayOfTheDay = require('./ofTheDay/holidayOfTheDay.js');
const jokeOfTheDay = require('./ofTheDay/jokeOfTheDay');
const memeOfTheDay = require('./ofTheDay/memeOfTheDay');
const moonPhase = require('./ofTheDay/phaseOfTheMoon');
const numberOfTheDay = require('./ofTheDay/numberOfTheDay');
const onThisDay = require('./ofTheDay/onThisDay');
const plantOTD = require('./ofTheDay/plantOfTheDay');
const poetryOfTheDay = require('./ofTheDay/poemOfTheDay');
const pokeOfTheDay = require('./ofTheDay/pokemonOfTheDay');
const puzzleOfTheDay = require('./ofTheDay/puzzleOfTheDay');
const riddleOfTheDay = require('./ofTheDay/riddleOfTheDay');
const songOfTheDay = require('./ofTheDay/songOfTheDay');
const wordOfTheDay = require('./ofTheDay/wordOfTheDay');


// https://discordjs.guide/popular-topics/faq.html#how-do-i-send-a-message-to-a-specific-channel
// gonna need to pass the discord client for some of these automations
module.exports = async function tasks(bot) {
  try {
    const conn = await db().asPromise();
    const setup = { db: conn }
    initTasks(null, setup.db);
    const { Task } = setup.db.models;
    // Task.registerHandler('ofTheDay', ofTheDay(setup.db, bot));
    // Task.registerHandler('happyBirthday', happyBirthday(setup.db, bot));
    // Task.registerHandler('remind', remind(bot));
    // Task.registerHandler('getHolidaysForTheYear', getHolidaysForTheYear());
    // Task.registerHandler('september', september(bot));
    // await Task.startPolling();
    // Testing Date
    // const testDate = new Date(2024, 4, 9, 14, 52, 0);
    // console.log(testDate)
    // await Task.findOneAndUpdate({ name: 'ofTheDay', status: 'pending' }, { scheduledAt: next6am, repeatAfterMS: millisecondsInDay }, { upsert: true, returnDocument: 'after' });
    // await Task.findOneAndUpdate({ name: 'happyBirthday', status: 'pending' }, { scheduledAt: next6am, repeatAfterMS: millisecondsInDay }, { upsert: true, returnDocument: 'after' });
    // await Task.findOneAndUpdate({ name: 'september', status: 'pending' }, { scheduledAt: earthWindAndFire, repeatAfterMS: millisecondsInYear }, { upsert: true, returnDocument: 'after' });
  } catch(error) {
    console.log('something went wrong registering all the handlers', error);
  }
}
// use pagination so that each entry can have their own embed
// https://pagination-djs.js.org/#md:other-send-options
async function ofTheDay(db, bot) {
  try {
    const { Daily } = db.models;
    // if obj pathing is doubly nested, need to predefine key in the obj
    const obj = { jokeOTD: {}, factOTD: {}, astropicOTD: {}, animalOTD: {}, riddleOTD: {}, songOTD: {}, plantOTD: {}, poemOTD: {} };
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
    obj.poemOTD.title = poemOfTheDay.title;
    obj.poemOTD.author = poemOfTheDay.author;
    fields.push({ name: 'Poem of the Day', value: `${poemOfTheDay.title} by ${poemOfTheDay.author}` });
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
    if (AOTD) {
      obj.animalOTD.name = AOTD.animalName;
      obj.animalOTD.scientificName = AOTD.scientificName;
      obj.animalOTD.image = AOTD.image;
      obj.animalOTD.funFact = AOTD.funFact;
      obj.animalOTD.link = AOTD.link;
      obj.animalOTD.briefSummary = AOTD.briefSummary;
      fields.push({ name: 'Animal of the Day', value: AOTD.name });
    } else {
      fields.push({ name: 'Animal of the Day', value: `None today` });
    }
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
    if (artOTD.met) {
      obj.metTitle = artOTD.met.title;
      obj.metImageLink = artOTD.met.image;
      obj.metArtist = artOTD.met.artist;
      fields.push({ name: 'Met Artwork of the Day', value: `${artOTD.met.image}`});
    }
    if (artOTD.chicago) {
      obj.chicagoTitle = artOTD.chicago.title;
      obj.chicagoImageLink = artOTD.chicago.image;
      obj.chicagoArtist = artOTD.chicago.artist;
      fields.push({ name: 'Chicago Artwork of the Day', value: `${artOTD.chicago.image}`});
    }
    const { plantInformation } = await plantOTD();
    obj.plantOTD.name = plantInformation.common_name;
    obj.plantOTD.id = plantInformation.id;
    fields.push({ name: 'Plant of the Day', value: plantInformation.common_name });
    const { historyOTD } = await onThisDay();
    obj.historyOTD = historyOTD;
    fields.push({ name: 'History of the Day', value: historyOTD });
    const { bookOTD } = await bookOfTheDay();
    obj.bookOTD = bookOTD;
    fields.push({ name: 'Book of the Day', value: `${bookOTD.title} https://openlibrary.org${bookOTD.bookRoute}` })
    const { countryOTD, countryEmojiFlag } = await countryOfTheDay();
    obj.countryOTD = countryOTD;
    fields.push({ name: 'Country of the Day', value: `${countryEmojiFlag} ${countryOTD} ${countryEmojiFlag}`})
    const { puzzleOTD } = await puzzleOfTheDay();
    obj.puzzleOTD = puzzleOTD;
    fields.push({ name: 'Puzzle of the Day', value: puzzleOTD });
    const date = new Date();
    const holidayOTD = holidayOfTheDay();
    obj.holidayOTD = holidayOTD; // now what
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${month}/${day}/${year}`;
    obj.dateString = formattedDate;
    const doc = await Daily.create(obj);
    console.log('what is doc', doc);
    } catch (error) {
      console.log('Of the day automation crashed', error);
    }
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

function earthWindAndFire() {
  const date = new Date()
  const year = date.getFullYear();
  const septemberTwentyFirst = new Date(year, 8, 21, 19);
  return septemberTwentyFirst;
}

// https://codereview.stackexchange.com/questions/33527/find-next-occurring-friday-or-any-dayofweek
function getNextWeekAt6() {

}
