const axios = require('axios');

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

// if met doesn't have an image link, move to chicago
async function met() {
  const res = await axios.get('https://collectionapi.metmuseum.org/public/collection/v1/objects').then(res => res.data);
  console.log('what is res', res, res.total, res.objectIDs.length);
  // ignore res.total
  const selectedArtwork = res.objectIDs[Math.floor(Math.random() * res.objectIDs.length)];
  console.log('what is selectedArtwork', selectedArtwork);
  const artwork = await axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${selectedArtwork}`).then(res => res.data).catch(e => console.log('what is e', e.message, e.request.path));
  console.log('what is artwork', artwork);
}

// concept working
async function chicago() {
  console.log('=======================================================');
  const { pagination } = await axios.get(`https://api.artic.edu/api/v1/images`).then(res => res.data)
  // begin randomization
  // first pick a page
  const page = Math.floor(Math.random() * pagination.total_pages) + 1;
  console.log('what is page', page);
  // now we query for that page
  const { data } = await axios.get(`https://api.artic.edu/api/v1/images?page=${page}`).then(res => res.data).catch(e => console.log(e.message))
  // now that we have our array of artworks, we choose one randomly
  console.log('what is data.length', data.length)
  const selectedArtwork = Math.floor(Math.random() * data.length);
  console.log('what is the artwork', data[selectedArtwork])
  // now we get the image link
  const test = await axios(`https://api.artic.edu/api/v1/artworks/${data[selectedArtwork].artwork_ids[0]}?fields=id,title,image_id`).then(res => res.data).catch(e => console.log(e.message));
  console.log('what is test', test);
  console.log('what is the link', `${test.config.iiif_url}/${test.data.image_id}/full/843,/0/default.jpg`);
  // example of the data set (paste in firefox) https://api.artic.edu/api/v1/artworks/4S
  const information = await axios(`https://api.artic.edu/api/v1/artworks/${test.data.id}`).then(res => res.data).catch(e => console.log(e.message));
  console.log('what is information', information)
}

met().then(() => chicago())