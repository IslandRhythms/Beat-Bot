const axios = require('axios');
require('../config');
const fs = require('fs');
const path = require ('path');
const puppeteer = require('puppeteer');

run();

async function run() {
  console.log('getting animal of the day ...')
  try {
    const browser = await puppeteer.launch({
      headless: false,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    });
    const page = await browser.newPage();
    const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const index = Math.floor(Math.random() * alphabet.length);
    const letter = alphabet[index];
    await page.goto(`https://a-z-animals.com/animals/animals-that-start-with-${letter.toLowerCase()}`);
    const animalChoices = await page.evaluate((letter) => {
      let header = document.querySelector(`#h-alphabetical-list-of-animals-that-start-with-${letter.toLowerCase()}`);
      if (header == null) {
        header = document.querySelector(`#h-animals-by-letter-count-letter-${letter.toLowerCase()}-animals-that-start-with-${letter.toLowerCase()}`);
      }
      const container = header.nextElementSibling;
      const ul = container.querySelector('ul');
      let listItems = Array.from(ul.querySelectorAll('li')).map(li => {
          const link = li.querySelector('a');
          return {
              animalName: li.innerText,
              link: link.href
          }
      });
      return listItems;
    }, letter);
    
    const animalIndex = Math.floor(Math.random() * animalChoices.length);
    const AOTD = animalChoices[animalIndex];
    const data = await page.evaluate((animalObj) => {
      let header = document.querySelector(`#h-animals-that-start-with-${animalObj.letter.toLowerCase()}`);
      if (header == null) {
        header = document.querySelector(`#h-animals-that-start-with-${animalObj.letter.toLowerCase()}-pictures-and-facts`);
      }
      const container = header.nextElementSibling;
      const animals = Array.from(container.querySelectorAll('h3 a'));
      let info = {};
      animals.forEach((a) => {
        if (a.textContent.trim() == animalObj.animal) {
          const div = a.parentNode.nextSibling;
          const imgDiv = div.querySelector('div:nth-child(1)');
          const imgAnchor = imgDiv.querySelector('a');
          const img = imgAnchor.querySelector('img');
          info.image = img ? img.src : '';
          
          // There's other stuff that I ignored because I didn't feel like it added anything.
          const scientificDiv = div.querySelector('div:nth-child(2)');
          const funFactTag = scientificDiv.querySelector('p');
          info.funFact = funFactTag ? funFactTag.textContent.trim() : '';
  
          const dlElement = scientificDiv.querySelector('dl');
          const tableData = dlElement.querySelectorAll('dd');
          const lastEntry = tableData[tableData.length - 1].textContent.trim();
          info.scientificName = lastEntry;
  
  
          const briefSummaryDiv = div.querySelector('div:nth-child(3)');
          const briefSummaryTag = briefSummaryDiv.querySelector('p');
          info.briefSummary = briefSummaryTag ? briefSummaryTag.textContent.trim() : '';
          const cutOff = info.briefSummary.indexOf('['); // info.briefSummary.indexOf('Read');
          info.briefSummary = info.briefSummary.substring(0, cutOff).trim();
        }
      })
      return info;
    }, { animal: AOTD.animalName, letter });
    await page.close();
    await browser.close();
    Object.assign(AOTD, data);
    console.log('what is AOTD', AOTD, data)
    return { AOTD: AOTD };
  } catch(error) {
    console.log('something went wrong with animal of the day', error);
    return { AOTD: null }
  }
}

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

//   const { data } = await axios.get(`https://vlrggapi.vercel.app/match?q=upcoming`).then(res => res.data);
//   console.log('what is data', data, data.segments, data.segments[0]);
// }

// async function run() {
//     // Launch a headless Chromium browser
//     const browser = await puppeteer.launch({
//       headless: false,
//       userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
//     });

//    // Create a new page
//    const page = await browser.newPage();

//    // Enable request interception
//    await page.setRequestInterception(true);

//    // Array to store network requests
//    const requests = [];

//    // Listen for network requests
//    page.on('request', request => {
//        requests.push({
//            url: request.url(),
//            method: request.method(),
//            headers: request.headers(),
//            postData: request.postData(),
//        });

//        // Continue with the request
//        request.continue();
//    });

//    // Navigate to the webpage
//    await page.goto('https://battlefy.com/apex-legends-global-series-year-4/pro-league-split-1-playoffs/group-stage');

//    // Wait for some time for the page to load (you might need to adjust this)
//    await page.waitForTimeout(5000);

//    // Write network requests to a JSON file
//    fs.writeFileSync('network_activity.json', JSON.stringify(requests, null, 2));

//    // Close the browser
//    await browser.close();
// }

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