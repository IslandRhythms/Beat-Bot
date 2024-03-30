'use strict';

const axios = require('axios');
const Jimp = require('jimp');

exports.processBasketball = async function processBasketball(config, status) {
  const { response } = await axios(config).then(res => res.data);
  let data = null;
  // read up on the statuses more
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

  } else { // in progress game

  }
  const homeImage = await downloadImage(data.teams.home.logo)
  const awayImage = await downloadImage(data.teams.away.logo);

  const imageResult = await createImage(homeImage, awayImage, 'basketball');

  return { awayTeam: data.teams.away.name,
    homeTeam: data.teams.home.name,
    when: new Date(data.timestamp * 1000).toLocaleString(),
    leagueLogo: data.league.logo,
    outputPath: imageResult.outputPath,
    fileName: imageResult.fileName,
    api: 'api-basketball.com' }
};

exports.processBaseBall = async function processBaseball(config, status) {

};

exports.processSoccer = async function processSoccer() {

};

exports.processFootball = async function processFootball() {

};

exports.processHockey = async function processHockey() {

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