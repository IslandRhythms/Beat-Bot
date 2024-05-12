const axios = require('axios');
require('./config');
const fs = require('fs');
const path = require ('path');
const puppeteer = require('puppeteer');


// async function run() {

//   // const config = {
//   //   method: 'get',
//   //   url: 'https://v3.football.api-sports.io/leagues',
//   //   headers: {
//   //     'x-rapidapi-key': process.env.SPORTSAPIKEY,
//   //     'x-rapidapi-host': 'v3.football.api-sports.io'
//   //   }
//   // };

//   // const  { response } = await axios(config).then(res => res.data);
//   // const leagues = ['Premier League', 'La Liga', 'Seria A', 'Bundesliga', 'MLS', 'Liga Argentina', 'Liga Brasilena', 'Liga Mexicana'];

//   // console.log(response.filter(x => leagues.includes(x.league.name)))

//   const test = {
//     method: 'GET',
//     url: `https://v1.basketball.api-sports.io/games?league=12&team=147&season=2023-2024`,
//     headers: {
//       'x-rapidapi-key': process.env.SPORTSAPIKEY,
//       'x-rapidapi-host': `v1.basketball.api-sports.io`
//     }
//   };

//   const res = await axios(test).then(res => res.data);
//   console.log(res.response, res.response.length, res.response[0])
// }

// async function run() {
//   const { data } = await axios.get(`https://vlrggapi.vercel.app/news`).then(res => res.data);
//   console.log('what is res', data, data.segments[0]);

//   const res = await axios.get(`https://vlrggapi.vercel.app/match/results`).then(res => res.data);
//   console.log('what is response', res, res.data.segments)

//   const test = await axios.get(`https://vlrggapi.vercel.app/match/upcoming`).then(res => res.data);
//   console.log('what is test', test, test.data.segments, test.data.segments[0]);
// }

async function run() {
    // Launch a headless Chromium browser
    const browser = await puppeteer.launch({
      headless: false,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    });

   // Create a new page
   const page = await browser.newPage();

   // Enable request interception
   await page.setRequestInterception(true);

   // Array to store network requests
   const requests = [];

   // Listen for network requests
   page.on('request', request => {
       requests.push({
           url: request.url(),
           method: request.method(),
           headers: request.headers(),
           postData: request.postData(),
       });

       // Continue with the request
       request.continue();
   });

   // Navigate to the webpage
   await page.goto('https://battlefy.com/apex-legends-global-series-year-4/pro-league-split-1-playoffs/group-stage');

   // Wait for some time for the page to load (you might need to adjust this)
   await page.waitForTimeout(5000);

   // Write network requests to a JSON file
   fs.writeFileSync('network_activity.json', JSON.stringify(requests, null, 2));

   // Close the browser
   await browser.close();
}

// async function run() {
//   console.log('getting artwork of the day ...');
//   // first check the met
//   const res = await axios.get('https://collectionapi.metmuseum.org/public/collection/v1/objects').then(res => res.data);
//   // objectIds are not sequential in the array, meaning objectid 52 might be missing but 53 and 51 are there. Therefore need to pull objectId out of the array.
//   const selectedObjectId = res.objectIDs[Math.floor(Math.random() * res.objectIDs.length)];
//   const artwork = await axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${selectedObjectId}`)
//     .then(res => res.data)
//     .catch(e => console.log('what is e', e.message, e.request.path));

//   const { pagination } = await axios.get(`https://api.artic.edu/api/v1/images`).then(res => res.data)
//   // begin randomization
//   // first pick a page
//   const page = Math.floor(Math.random() * pagination.total_pages) + 1;
//   // now we query for that page
//   const { data } = await axios.get(`https://api.artic.edu/api/v1/images?page=${page}`).then(res => res.data).catch(e => console.log(e.message))
//   // now that we have our array of artworks, we choose one randomly
//   const selectedArtwork = Math.floor(Math.random() * data.length);
//   // now we get the image link
//   const art = await axios(`https://api.artic.edu/api/v1/artworks/${data[selectedArtwork].artwork_ids[0]}?fields=id,title,image_id`).then(res => res.data).catch(e => console.log(e.message));
//   console.log('what is art', art);
//   // example of the data set (paste in firefox) https://api.artic.edu/api/v1/artworks/4S
//   const information = await axios(`https://api.artic.edu/api/v1/artworks/${art.data.id}`).then(res => res.data).catch(e => console.log(e.message));
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