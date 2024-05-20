'use strict';

const db = require('../db');
const initTasks = require('@mongoosejs/task');
const millisecondsInDay = 86400000;
const millisecondsInWeek = 604800000;
const millisecondsInYear = 31556952000;

const { EmbedBuilder } = require('discord.js');

const sendMessageTo = require('../helpers/sendMessageTo.js');

const apexMatches = require('./apexMatches.js');
const getHolidaysForTheYear = require('./getHolidaysForTheYear.js');
const happyBirthday = require('./happyBirthday');
const remind = require('./remind');
const september = require('./september.js');
const valorantMatchesOfTheDay = require('./valorantMatchesOfTheDay.js');

// sports automation

const baseball = require('./sportsAutomations/baseball.js');
const basketball = require('./sportsAutomations/basketball.js');
const football = require('./sportsAutomations/football.js');
const soccer = require('./sportsAutomations/soccer.js');
const hockey = require('./sportsAutomations/hockey.js');

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
    const { Task, Log } = setup.db.models;
    Task.registerHandler('ofTheDay', function dailyMessage() {
      return ofTheDay(setup.db, bot)
    });
    Task.registerHandler('happyBirthday', async function birthdayMessage() {
      console.log('Running happy birthday');
      try {
        happyBirthday(setup.db, bot)
      } catch (error) {
        await Log.create({ 
          message: error.message,
          commandName: 'Happy Birthday Automation',
          data: error,
          commandArgs: { db: setup.db, bot }
        })
      }
    });
    Task.registerHandler('remind', async function remindMessage(params) {
      console.log('Handler remindMessage started with params:', params);
      try {
        await remind(bot, params);
        console.log('Handler remindMessage completed successfully');
      } catch (error) {
        console.error('Handler remindMessage encountered an error:', error);
        await Log.create({ 
          message: error.message,
          commandName: 'Remind Automation',
          data: error,
          commandArgs: { params, bot }
        })
      }
    });
    Task.registerHandler('apexMatches', async function messageData(params) {
      console.log('apex handler with params', params);
      try {
        await apexMatches(bot, params)
      } catch (error) {
        await Log.create({ 
          message: error.message,
          commandName: 'Apex Automation',
          data: error,
          commandArgs: { params, bot }
        })
      }
    });
    Task.registerHandler('getHolidaysForTheYear', getHolidaysForTheYear);
    Task.registerHandler('september', function quirkMessage() {
      return september(bot);
    });
    Task.registerHandler('valorantMatchesOfTheDay', function valorantInformation() {
      return valorantMatchesOfTheDay(bot);
    });
    Task.registerHandler('basketball', basketball);
    Task.registerHandler('baseball', baseball);
    Task.registerHandler('soccer', soccer);
    Task.registerHandler('hockey', hockey);
    Task.registerHandler('football', football);
    await Task.startPolling();
    // Testing Date
    // const testDate = new Date(2024, 4, 19, 12, 47, 0);
    await Task.findOneAndUpdate({ name: 'ofTheDay', status: 'pending' }, { scheduledAt: next6am(), repeatAfterMS: millisecondsInDay }, { upsert: true, returnDocument: 'after' });
    await Task.findOneAndUpdate({ name: 'happyBirthday', status: 'pending' }, { scheduledAt: next6am(), repeatAfterMS: millisecondsInDay }, { upsert: true, returnDocument: 'after' });
    await Task.findOneAndUpdate({ name: 'september', status: 'pending' }, { scheduledAt: earthWindAndFire(), repeatAfterMS: millisecondsInYear }, { upsert: true, returnDocument: 'after' });
    await Task.findOneAndUpdate({ name: 'getHolidaysForTheYear', status: 'pending' }, { scheduledAt: firstDayOfTheYear(), repeatAfterMS: millisecondsInYear }, { upsert: true, returnDocument: 'after' });
    await Task.findOneAndUpdate({ name: 'valorantMatchesOfTheDay', status: 'pending' }, { scheduledAt: midnight(), repeatAfterMS: millisecondsInDay }, { upsert: true, returnDocument: 'after' });
    await Task.findOneAndUpdate({ name: 'basketball', status: 'pending' }, { scheduledAt: scheduleBasketball(), repeatAfterMS: millisecondsInYear }, { upsert: true, returnDocument: 'after' });
    await Task.findOneAndUpdate({ name: 'baseball', status: 'pending' }, { scheduledAt: scheduleBaseball(), repeatAfterMS: millisecondsInYear }, { upsert: true, returnDocument: 'after' });
    await Task.findOneAndUpdate({ name: 'soccer', status: 'pending' }, { scheduledAt: scheduleSoccer(), repeatAfterMS: millisecondsInYear }, { upsert: true, returnDocument: 'after' });
    await Task.findOneAndUpdate({ name: 'football', status: 'pending' }, { scheduledAt: scheduleFootball(), repeatAfterMS: millisecondsInYear }, { upsert: true, returnDocument: 'after' });
    await Task.findOneAndUpdate({ name: 'hockey', status: 'pending' }, { scheduledAt: scheduleHockey(), repeatAfterMS: millisecondsInYear }, { upsert: true, returnDocument: 'after' });
  } catch(error) {
    console.log('something went wrong registering all the handlers', error);
  }
}
// use pagination so that each entry can have their own embed
// https://pagination-djs.js.org/#md:other-send-options
// Do sections so there's less to navigate per page, plus no timeout so its historical
async function ofTheDay(db, bot) {
  try {
    const { Daily, BugReport } = db.models;
    const yesterDoc = await Daily.findOne().sort({ createdAt: -1 });
    console.log('what is yesterDoc', yesterDoc)
    if (yesterDoc) {
      const yesterEmbed = new EmbedBuilder();
      const bugReports = await BugReport.countDocuments({ status: { $nin: ['Done', 'Third Party Problem', 'Expected', 'Feature Request'] } });
      const features = await BugReport.countDocuments({ status: `Feature Request` });
      yesterEmbed.setTitle(`Daily Report: ${new Date().toLocaleString()}`)
      if (yesterDoc.pings.length > 0) {
        yesterEmbed.setDescription(`${yesterDoc.pings.map(ping => `${ping.name} - ${ping.called}`).join('\n') ?? `No pings to report`}`)
      }
      yesterEmbed.addFields(
        { name: `Total Bug Reports`, value: `${bugReports}`, inline: true },
        { name: `Total Feature Requests`, value: `${features}`, inline: true }
      );
      sendMessageTo.sendMessageToOwner(bot, { embeds: [yesterEmbed] });
    }
    const embeds = [];
    // if obj pathing is doubly nested, need to predefine key in the obj
    const obj = { jokeOTD: {}, factOTD: {}, astropicOTD: {}, animalOTD: {}, riddleOTD: {}, songOTD: {}, plantOTD: {}, poemOTD: {}, memeOTD: {} };
    const holidayOTD = holidayOfTheDay();
    obj.holidayOTD = holidayOTD; // now what
    // Daily Facts and Trivia Embed
    const knowledgeEmbed = new EmbedBuilder().setTitle(`Daily Facts and Trivia. ${holidayOTD ?? ``}`);
    const { WOTD } = await wordOfTheDay();
    obj.wordOTD = WOTD;
    knowledgeEmbed.addFields({ name: 'Word of the Day', value: WOTD });
    const { numberOTD } = await numberOfTheDay();
    obj.numberOTD = numberOTD;
    knowledgeEmbed.addFields({ name: 'Number of the Day', value: `${numberOTD}` });
    const { jokeOTD } = await jokeOfTheDay();
    if (jokeOTD.setup) {
      obj.jokeOTD.setup = jokeOTD.setup;
      obj.jokeOTD.delivery = jokeOTD.delivery;
      knowledgeEmbed.addFields({ name: `Joke of the Day ${!jokeOTD.safe ? `(NSFW)` : ``}`, value: `${jokeOTD.setup} || ${jokeOTD.delivery} ||` });
    } else {
      obj.jokeOTD.joke = jokeOTD.joke;
      knowledgeEmbed.addFields({ name: `Joke of the Day ${!jokeOTD.safe ? `(NSFW)` : ``}`, value: `|| ${jokeOTD.joke} ||` });
    }
    const { factOTD } = await factOfTheDay();
    obj.factOTD.fact = factOTD.fact;
    obj.factOTD.source = factOTD.source;
    knowledgeEmbed.addFields({ name: 'Fact of the Day', value: `${factOTD.fact} Source: ${factOTD.source}` });
    const { riddleOTD } = await riddleOfTheDay();
    obj.riddleOTD.riddle = riddleOTD.riddle;
    obj.riddleOTD.answer = riddleOTD.answer;
    knowledgeEmbed.addFields({ name: 'Riddle of the Day', value: `${riddleOTD.riddle} || ${riddleOTD.answer} ||`});
    const { puzzleOTD } = await puzzleOfTheDay();
    if (puzzleOTD) {
      obj.puzzleOTD = puzzleOTD;
      knowledgeEmbed.addFields({ name: 'Puzzle of the Day', value: puzzleOTD });
    } else {
      knowledgeEmbed.addFields({ name: 'Puzzle of the Day', value: `Could not get` });
    }
    embeds.push(knowledgeEmbed);
    // Arts and Literature Embed
    const artEmbed = new EmbedBuilder().setTitle(`Daily Arts and Literature`);
    const { poemOfTheDay } = await poetryOfTheDay();
    obj.poemOTD.title = poemOfTheDay.title;
    obj.poemOTD.author = poemOfTheDay.author;
    artEmbed.addFields({ name: 'Poem of the Day', value: `${poemOfTheDay.title} by ${poemOfTheDay.author}` });
    const artOTD = await artworkOfTheDay();
    console.log(artOTD)
    if (artOTD.met) {
      obj.metTitle = artOTD.met.title;
      obj.metImageLink = artOTD.met.image;
      obj.metArtist = artOTD.met.artist;
      artEmbed.addFields({ name: 'Met Artwork of the Day', value: `${artOTD.met.image.length > 0 ? artOTD.met.image : `No Image`}`});
    }
    if (artOTD.chicago) {
      obj.chicagoTitle = artOTD.chicago.title;
      obj.chicagoImageLink = artOTD.chicago.image;
      obj.chicagoArtist = artOTD.chicago.artist;
      artEmbed.addFields({ name: 'Chicago Artwork of the Day', value: `${artOTD.chicago.image.length > 0 ? artOTD.chicago.image : `No Image`}`});
    }
    const { bookOTD } = await bookOfTheDay();
    obj.bookOTD = bookOTD;
    artEmbed.addFields({ name: 'Book of the Day', value: `${bookOTD.title} https://openlibrary.org${bookOTD.bookRoute}` });
    embeds.push(artEmbed);
    // Entertainment Embed
    const entertainmentEmbed = new EmbedBuilder().setTitle(`Daily Entertainment Selection`);
    const { memeOTD } = await memeOfTheDay();
    if (memeOTD.title) {
      obj.memeOTD.url = memeOTD.url;
      obj.memeOTD.title = memeOTD.title;
      obj.memeOTD.NSFW = memeOTD.NSFW;
      obj.memeOTD.postLink = memeOTD.postLink
      entertainmentEmbed.addFields({ name: `Meme of the Day ${memeOTD.NSFW ? `(NSFW)` : ``}`, value: `${memeOTD.postLink}` });
    } else {
      entertainmentEmbed.addFields({ name: `Meme of the Day`, value: `Could not get meme` });
    }
    const sOTD = await songOfTheDay();
    if (sOTD.name) {
      obj.songOTD.name = sOTD.name;
      obj.songOTD.artist = sOTD.artist;
      obj.songOTD.url = sOTD.url;
      obj.songOTD.image = sOTD.image;
      obj.songOTD.genre = sOTD.genre;
      entertainmentEmbed.addFields({ name: 'Song of the Day', value: `${sOTD.name} by ${sOTD.artist} ${sOTD.url}` });
    } else {
      entertainmentEmbed.addFields({ name: 'Song of the Day', value: `Unable to retrieve for today` });
    }
   
    const { pokemonOTD } = await pokeOfTheDay();
    obj.pokemonOTD = pokemonOTD;
    entertainmentEmbed.addFields({ name: 'Pokemon of the Day', value: pokemonOTD });
    embeds.push(entertainmentEmbed);
    // Nature and Science
    const scienceEmbed = new EmbedBuilder().setTitle('Daily Nature and Science Selection');
    const { astropicOTD } = await astropicOfTheDay();
    if (astropicOTD.url) {
      obj.astropicOTD.url = astropicOTD.url;
      obj.astropicOTD.title = astropicOTD.title;
      obj.astropicOTD.description = astropicOTD.description;
      scienceEmbed.addFields({ name: 'Astronomy Picture of the Day', value: `${astropicOTD.title} ${astropicOTD.description} ${astropicOTD.url}`});
      scienceEmbed.setImage(astropicOTD.url);
    } else {
      scienceEmbed.addFields({ name: 'Astronomy Picture of the Day', value: `Unable to retrieve Image`})
    }
    const { AOTD } = await animalOfTheDay();
    console.log(AOTD)
    if (AOTD) {
      obj.animalOTD.name = AOTD.animalName;
      obj.animalOTD.scientificName = AOTD.scientificName;
      obj.animalOTD.image = AOTD.image;
      obj.animalOTD.funFact = AOTD.funFact;
      obj.animalOTD.link = AOTD.link;
      obj.animalOTD.briefSummary = AOTD.briefSummary;
      scienceEmbed.addFields({ name: 'Animal of the Day', value: AOTD.animalName });
    } else {
      scienceEmbed.addFields({ name: 'Animal of the Day', value: `None today` });
    }
    const { plantInformation } = await plantOTD();
    console.log('what is plantInformation', plantInformation);
    if (!plantInformation) {
      scienceEmbed.addFields({ name: 'Plant of the Day', value: `Could not get today`})
    } else {
      obj.plantOTD.name = plantInformation.common_name;
      obj.plantOTD.id = plantInformation.id;
      scienceEmbed.addFields({ name: 'Plant of the Day', value: plantInformation.common_name });
  
    }
    const { phaseOfTheMoon } = await moonPhase();
    obj.phaseOfTheMoon = phaseOfTheMoon;
    scienceEmbed.addFields({ name: 'Moon Phase Today', value: `${phaseOfTheMoon.phase} ${phaseOfTheMoon.moon}`});
    embeds.push(scienceEmbed);
    // History and Culture
    const historyEmbed = new EmbedBuilder().setTitle(`Daily History and Culture Selection`);
    const { historyOTD } = await onThisDay();
    obj.historyOTD = historyOTD;
    historyEmbed.addFields({ name: 'History of the Day', value: historyOTD });
    const { countryOTD, countryEmojiFlag } = await countryOfTheDay();
    obj.countryOTD = countryOTD;
    historyEmbed.addFields({ name: 'Country of the Day', value: `${countryEmojiFlag} ${countryOTD} ${countryEmojiFlag}`})


    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${month}/${day}/${year}`;
    obj.dateString = formattedDate;
    obj.totalBugReports = await BugReport.countDocuments({ status: { $nin: ['Done', 'Third Party Problem', 'Expected'] } });
    const doc = await Daily.create(obj);
    console.log('what is doc', doc);
    // sendMessageTo.sendMessageToTest(bot, { embeds })
    sendMessageTo.sendMessageToDaily(bot, { embeds });
    } catch (error) {
      console.log('Of the day automation crashed', error);
      const { Log } = db.models;
      await Log.create({
        message: error.message,
        commandName: 'Of the Day automation',
        data: error
      })
    }
}
function next6am() {
  const today = new Date();
  if (today.getHours() < 6) {
    today.setHours(6);
    today.setMinutes(0);
    today.setSeconds(5); // add a buffer between starting the script and it getting to the task start.
    return today;
  }
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  tomorrow.setHours(6);
  tomorrow.setMinutes(0);
  tomorrow.setSeconds(5); // add a buffer between starting the script and it getting to the task start.
  return tomorrow;
}

function firstDayOfTheYear() {
  const date = new Date();
  return new Date(date.getFullYear(), 0, 1, 8);
}

function midnight() {
  const today = new Date();
  today.setDate(today.getDate() + 1);
  today.setHours(0);
  today.setSeconds(5);
  return today;
}

function earthWindAndFire() {
  const date = new Date()
  const year = date.getFullYear();
  const septemberTwentyFirst = new Date(year, 8, 21, 19);
  return septemberTwentyFirst;
}

function scheduleBasketball() {
  const date = new Date();
  // September 7th
  return new Date(date.getFullYear(), 8, 7)
}

function scheduleBaseball() {
  const date = new Date();
  // March 7th
  return new Date(date.getFullYear(), 2, 7)
}

function scheduleSoccer() {
  const date = new Date();
  // July 23rd
  return new Date(date.getFullYear(), 6, 23)
}

function scheduleHockey() {
  const date = new Date();
  // July 15th
  return new Date(date.getFullYear(), 6, 15)
}

function scheduleFootball() {
  const date = new Date();
  // May 24th. Extra week to give the api time to update the schedule
  return new Date(date.getFullYear(), 4, 24)
}

// https://codereview.stackexchange.com/questions/33527/find-next-occurring-friday-or-any-dayofweek
function getNextWeekAt6() {

}
