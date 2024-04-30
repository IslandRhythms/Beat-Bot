'use strict';

const axios = require('axios');
const Jimp = require('jimp');

// multiple finished statuses for some sports. Include them in the if statements.
// optimization: each command file has a similar config object. We could use the subcommands to change the relevant parts and eliminate the multiple config creations

exports.processBasketball = async function processBasketball(config, status) {
  const { response } = await axios(config).then(res => res.data);
  let data = null;
  let scores = null;
  if (status == 'NS' || status.length > 0) { // not started or Finished Game
    let games = null;
    if (Array.isArray(status)) {
      games = response.filter(x =>  status.includes(x.status.short));
    } else {
      games = response.filter(x => x.status.short == status);
    }
    if (games && games.length < 1) {
      return;
    }
    data = games.sort(function(a,b) {
      if(a.timestamp < b.timestamp) {
        return -1;
      } else {
        return 1;
      }
    })[0];
  } else { // in progress game
    const inProgressStatuses = ['Q1', 'Q2', 'Q3', 'Q4', 'OT', 'BT', 'HT'];
    data = response.filter(x => inProgressStatuses.includes(x.status.short))[0];
    const keys = Object.keys(data.scores.home);
    for (let i = 0; i < keys.length; i++) {
      const abbreviation = snakeCaseToAbbreviation(keys[i]);
      if (data.status.short == 'HT') {
        const obj = {};
        obj.home = data.scores.home['quarter_2'];
        obj.away = data.scores.away['quarter_2'];
        scores = obj;
        break;
      }
      else if (abbreviation == data.status.short) {
        const obj = {};
        obj.home = data.scores.home[keys[i]];
        obj.away = data.scores.away[keys[i]];
        scores = obj;
        break;
      }
    }
  }
  const homeImage = await downloadImage(data.teams.home.logo)
  const awayImage = await downloadImage(data.teams.away.logo);

  const imageResult = await createImage(homeImage, awayImage, 'basketball');

  return { awayTeam: data.teams.away.name,
    homeTeam: data.teams.home.name,
    when: new Date(data.timestamp * 1000).toLocaleString(),
    scores: scores,
    rawScores: data.scores,
    leagueLogo: data.league.logo,
    status: data.status,
    outputPath: imageResult.outputPath,
    fileName: imageResult.fileName,
    api: 'api-basketball.com' }
};

exports.processBaseball = async function processBaseball(config, status) {
  const { response } = await axios(config).then(res => res.data);
  let data = null;
  if (status == 'NS' || status == 'FT') { // not started or Finished Game
    const games = response.filter(x => x.status.short == status);
    if (games && games.length < 1) {
      return;
    }
    data = games.sort(function(a,b) {
      if(a.timestamp < b.timestamp) {
        return -1;
      } else {
        return 1;
      }
    })[0];
  } else { // in progress game
    const inProgressStatuses = ['IN1', 'IN2', 'IN3', 'IN4', 'IN5', 'IN6', 'IN7', 'IN8', 'IN9'];
    data = response.filter(x => inProgressStatuses.includes(x.status.short))[0];
  }
  const homeImage = await downloadImage(data.teams.home.logo)
  const awayImage = await downloadImage(data.teams.away.logo);

  const imageResult = await createImage(homeImage, awayImage, 'baseball');

  return { awayTeam: data.teams.away.name,
    homeTeam: data.teams.home.name,
    when: new Date(data.timestamp * 1000).toLocaleString(),
    scores: data.scores,
    leagueLogo: data.league.logo,
    status: data.status,
    outputPath: imageResult.outputPath,
    fileName: imageResult.fileName,
    api: 'api-baseball.com' }
};

exports.processHockey = async function processHockey(config, status) {
  const { response } = await axios(config).then(res => res.data);
  let data = null;
  if (status == 'NS' || status.length > 0) { // not started or Finished Game
    let games = null;
    if (Array.isArray(status)) {
      games = response.filter(x =>  status.includes(x.status.short));
    } else {
      games = response.filter(x => x.status.short == status);
    }
    if (games && games.length < 1) {
      return;
    }
    data = games.sort(function(a,b) {
      if(a.timestamp < b.timestamp) {
        return -1;
      } else {
        return 1;
      }
    })[0];
  } else { // in progress game
    const inProgressStatuses = ['P1', 'P2', 'P3', 'OT', 'PT', 'BT'];
    data = response.filter(x => inProgressStatuses.includes(x.status.short))[0];
  }
  const homeImage = await downloadImage(data.teams.home.logo)
  const awayImage = await downloadImage(data.teams.away.logo);

  const imageResult = await createImage(homeImage, awayImage, 'hockey');

  return { awayTeam: data.teams.away.name,
    homeTeam: data.teams.home.name,
    scores: data.scores,
    when: new Date(data.timestamp * 1000).toLocaleString(),
    leagueLogo: data.league.logo,
    status: data.status,
    outputPath: imageResult.outputPath,
    fileName: imageResult.fileName,
    api: 'api-hockey.com' }
};

// needs work, multiple finished match statuses
exports.processSoccer = async function processSoccer(config, status) {
  const { response } = await axios(config).then(res => res.data);
  let data = null;

  if (status == 'NS' || status.length > 0) { // not started or Finished Game
    let games = null;
    if (Array.isArray(status)) {
      games = response.filter(x =>  status.includes(x.fixture.status.short));
    } else {
      games = response.filter(x => x.fixture.status.short == status);
    }
    if (games && games.length < 1) {
      return;
    }
    data = games.sort(function(a,b) {
      if(a.timestamp < b.timestamp) {
        return -1;
      } else {
        return 1;
      }
    })[0];
  } else { // in progress game
    const inProgressStatuses = ['1H', 'HT', '2H', 'ET', 'BT', 'P', 'LIVE'];
    data = response.filter(x => inProgressStatuses.includes(x.fixture.status.short))[0];
  }
  const homeImage = await downloadImage(data.teams.home.logo)
  const awayImage = await downloadImage(data.teams.away.logo);

  const imageResult = await createImage(homeImage, awayImage, 'soccer');

  return { awayTeam: data.teams.away.name,
    homeTeam: data.teams.home.name,
    scores: data.score,
    when: new Date(data.fixture.timestamp * 1000).toLocaleString(),
    leagueLogo: data.league.logo,
    status: data.status,
    outputPath: imageResult.outputPath,
    fileName: imageResult.fileName,
    api: 'api-football.com' }
};

exports.processFootball = async function processFootball(config, status) {
  const { response } = await axios(config).then(res => res.data);
  let data = null;
  if (status == 'NS' || status == 'FT') { // not started or Finished Game
    let games = null;
    if (Array.isArray(status)) {
      games = response.filter(x =>  status.includes(x.game.status.short));
    } else {
      games = response.filter(x => x.game.status.short == status);
    }
    if (games && games.length < 1) {
      return;
    }
    data = games.sort(function(a,b) {
      if(a.timestamp < b.timestamp) {
        return -1;
      } else {
        return 1;
      }
    })[0];
  } else { // in progress game
    const inProgressStatuses = ['Q1', 'Q2', 'Q3', 'Q4', 'OT', 'HT'];
    data = response.filter(x => inProgressStatuses.includes(x.game.status.short))[0];
  }
  const homeImage = await downloadImage(data.teams.home.logo)
  const awayImage = await downloadImage(data.teams.away.logo);

  const imageResult = await createImage(homeImage, awayImage, 'football');

  return { awayTeam: data.teams.away.name,
    homeTeam: data.teams.home.name,
    scores: data.scores,
    when: new Date(data.game.date.timestamp * 1000).toLocaleString(),
    leagueLogo: data.league.logo,
    outputPath: imageResult.outputPath,
    status: data.status,
    fileName: imageResult.fileName,
    api: 'api-american-football.com' }
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
  const outputPath = `../next${sport}event.png`;
  await canvas.writeAsync(outputPath);
  return { outputPath: outputPath, fileName: `next${sport}event.png`} // change file name perhaps?
}

function snakeCaseToAbbreviation(str) {
  // Split the string by underscores
  const parts = str.split('_');

  // Initialize an empty string to store the abbreviation
  let abbreviation = '';

  // Iterate over each part of the string
  for (const part of parts) {
      // Add the first character of each part to the abbreviation string
      abbreviation += part.charAt(0).toUpperCase();
  }

  // Return the abbreviation
  return abbreviation;
}