const axios = require('axios');
require('./config');

/*
async function run() {
  const res = await axios.get(`https://site.web.api.espn.com/apis/site/v2/sports/basketball/nba/teams/14`).then(res => res.data);
  console.log('what is res', res, res.team.nextEvent);

  // doesn't work for whatever reason
  const test = await axios.get(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/14/schedule`).then(res => res.data).catch(e => console.log(e.code))
  
  const response = await axios.get(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard`).then(res => res.data)

  console.log('what is response', response)
  // const teams = await axios.get(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/miami-heat/roster`)

  const teams = await axios.get(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams`).then(res => res.data.sports[0]);
  console.log('========')
  console.log(teams);
  console.log(teams.leagues)
  console.log(teams.leagues[0].teams[0])
  console.log(teams.leagues[0].teams.length)
}

run();

*/

async function run() {
  let url = `https://perenual.com/api/species-list?key=${process.env.PLANTAPIKEY}`;
  const { last_page } = await axios.get(url).then(res => res.data);
  const selectedPage = Math.floor(Math.random() * last_page) + 1; // +1 because there is no page 0
  url += `&page=${selectedPage}`;
  const { data } = await axios.get(url).then(res => res.data);
  const selectedPlantIndex = Math.floor(Math.random() * data.length);
  console.log('The plant of the day is', data[selectedPlantIndex]);
  const plantOfTheDay = data[selectedPlantIndex];
  console.log('Getting plant information ...');
  const plantInformation = await axios.get(`https://perenual.com/api/species/details/${plantOfTheDay.id}?key=${process.env.PLANTAPIKEY}`).then(res => res.data);
  console.log(plantInformation);
  // what to do with this?
  const plantDisease = await axios.get(`https://perenual.com/api/pest-disease-list?key=${process.env.PLANTAPIKEY}`).then(res => res.data);
  console.log(plantDisease.data[0])
}

run();