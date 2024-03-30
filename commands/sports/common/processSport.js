'use strict';

const axios = require('axios');
const Jimp = require('jimp');

// TODO: Hockey, Basketball, and Baseball have the same flow so possible optimization here.
exports.processBasketball = async function processBasketball(config, status) {
  const { response } = await axios(config).then(res => res.data);
  let data = null;
  // read up on the statuses more
  // combine NS and FT when we confirm they function the same
  if (status == 'NS') { // not started
    const futureGames = response.filter(x => x.status.short == status);
    if (futureGames && futureGames.length < 1) {
      return;
    }
    data = futureGames.sort(function(a,b) {
      if(a.timestamp < b.timestamp) {
        return -1;
      } else {
        return 1;
      }
    })[0];
  } else if (status == 'FT') { // finished
    const pastGames = response.filter(x => x.status.short == status);
    if (pastGames && pastGames.length < 1) {
      return;
    }
    data = pastGames.sort(function(a,b) {
      if(a.timestamp < b.timestamp) {
        return -1;
      } else {
        return 1;
      }
    })[0];
  } else if (!status) { // get the schedule
    
  } else { // in progress game
    const inProgressStatuses = ['Q1', 'Q2', 'Q3', 'Q4', 'OT', 'BT', 'HT'];
    data = response.filter(x => inProgressStatuses.includes(x.status.short));
  }
  const homeImage = await downloadImage(data.teams.home.logo)
  const awayImage = await downloadImage(data.teams.away.logo);

  const imageResult = await createImage(homeImage, awayImage, 'basketball');

  return { awayTeam: data.teams.away.name,
    homeTeam: data.teams.home.name,
    when: new Date(data.timestamp * 1000).toLocaleString(),
    scores: data.scores,
    leagueLogo: data.league.logo,
    outputPath: imageResult.outputPath,
    fileName: imageResult.fileName,
    api: 'api-basketball.com' }
};

exports.processBaseball = async function processBaseball(config, status) {

};

exports.processSoccer = async function processSoccer() {

};

exports.processFootball = async function processFootball() {

};

exports.processHockey = async function processHockey(config, status) {
  const { response } = await axios(config).then(res => res.data);

  const futureGames = response.filter(x => x.status.short == status);
  if (futureGames && futureGames.length < 1) {
    return;
  }
  const nextGame = futureGames.sort(function(a,b) {
    if(a.timestamp < b.timestamp) {
      return -1;
    } else {
      return 1;
    }
  })[0];
  const homeImage = await downloadImage(nextGame.teams.home.logo)
  const awayImage = await downloadImage(nextGame.teams.away.logo);

  const imageResult = await createImage(homeImage, awayImage, 'baseball');

  return { awayTeam: nextGame.teams.away.name,
    homeTeam: nextGame.teams.home.name,
    when: new Date(nextGame.timestamp * 1000).toLocaleString(),
    leagueLogo: nextGame.league.logo,
    outputPath: imageResult.outputPath,
    fileName: imageResult.fileName,
    api: 'api-hockey.com' }
};

async function downloadImage(url) {
  const res = await axios.get(url, { responseType: 'arraybuffer' }).then(res => res.data);
  return await Jimp.read(res);
}

async function createImage(homeImage, awayImage, sport) {

  const width = Math.max(homeImage.getWidth(), awayImage.getWidth())
  const height = Math.max(homeImage.getWidth(), awayImage.getWidth());


  const canvas = new Jimp(width * 2, height);

  const xPos1 = Math.floor((width - awayImage.getWidth()) / 2);
  const xPos2 = Math.floor((width - homeImage.getWidth()) / 2) + width;

  canvas.composite(awayImage, xPos1, Math.floor((height - awayImage.getHeight()) / 2));
  canvas.composite(homeImage, xPos2, Math.floor((height - homeImage.getHeight()) / 2));
  const outputPath = `../../../next${sport}event.png`;
  await canvas.writeAsync(outputPath);
  return { outputPath: outputPath, fileName: `next${sport}event.png`}
}