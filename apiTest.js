const axios = require('axios');
require('./config');


async function run() {

  const config = {
    method: 'get',
    url: 'https://v3.football.api-sports.io/leagues',
    headers: {
      'x-rapidapi-key': process.env.SPORTSAPIKEY,
      'x-rapidapi-host': 'v3.football.api-sports.io'
    }
  };

  const  { response } = await axios(config).then(res => res.data);
  const leagues = ['Premier League', 'La Liga', 'Seria A', 'Bundesliga', 'MLS', 'Liga Argentina', 'Liga Brasilena', 'Liga Mexicana'];

  console.log(response.filter(x => leagues.includes(x.league.name)))

  // const test = {
  //   method: 'GET',
  //   url: `https://v1.basketball.api-sports.io/games?league=12&team=147&season=2023-2024`,
  //   headers: {
  //     'x-rapidapi-key': process.env.SPORTSAPIKEY,
  //     'x-rapidapi-host': `v1.basketball.api-sports.io`
  //   }
  // };

  // const res = await axios(test).then(res => res.data);
  // console.log(res.response, res.response.length, res.response[0])
}

// async function run() {
//   const { data } = await axios.get(`https://vlrggapi.vercel.app/news`).then(res => res.data);
//   console.log('what is res', data, data.segments[0]);

//   const res = await axios.get(`https://vlrggapi.vercel.app/match/results`).then(res => res.data);
//   console.log('what is response', res, res.data.segments)

//   const test = await axios.get(`https://vlrggapi.vercel.app/match/upcoming`).then(res => res.data);
//   console.log('what is test', test, test.data.segments, test.data.segments[0]);
// }
run();

// async function run() {
//   // free tier only allows up to id 3000
//   /*
//   let url = `https://perenual.com/api/species-list?key=${process.env.PLANTAPIKEY}`;
//   const { last_page } = await axios.get(url).then(res => res.data);
//   const selectedPage = Math.floor(Math.random() * last_page) + 1; // +1 because there is no page 0
//   url += `&page=${selectedPage}`;
//   const { data } = await axios.get(url).then(res => res.data).catch(e => console.log(e.message));
//   const selectedPlantIndex = Math.floor(Math.random() * data.length);
//   console.log('The plant of the day is', data[selectedPlantIndex]);
//   const plantOfTheDay = data[selectedPlantIndex];
//   */
//   console.log('Getting plant information ...');
//   const plantOfTheDayId = Math.floor(Math.random() * 3000) + 1;
//   const plantInformation = await axios.get(`https://perenual.com/api/species/details/${plantOfTheDayId}?key=${process.env.PLANTAPIKEY}`).then(res => res.data).catch(e => console.log(e.message));
//   console.log(plantInformation);
// }

// run()