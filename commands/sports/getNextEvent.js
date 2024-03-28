const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const Basketball = require('../../sportsData/Basketball.json');
const Football = require('../../sportsData/Football.json');
const Baseball = require('../../sportsData/Baseball.json');
const Hockey = require('../../sportsData/Hockey.json');
const Soccer = require('../../sportsData/Soccer.json')
const Jimp = require('jimp');
const sportsAutocomplete = require('./common/autocomplete.js')
const commandDef = require('./common/commandDef.js');

module.exports = {
  cooldown: 30,
  data: commandDef('getnextevent', 'get the next event for the indicated team'),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const league = interaction.options.getString('league');
    const team = interaction.options.getString('team');
    const sport = interaction.options._subcommand;
    let leagueId = '';
    let teamId = '';
    let season = '';
    let nextGame = null;
    if (sport == 'basketball') {
      leagueId = Basketball[league].id;
      const selectedTeam = Basketball[league]['teams'].find(x => x.name == team);
      if (!selectedTeam) {
        return interaction.followUp(`${team} was not found in the ${league} league, please make sure you chose the correct team and league.`);
      }
      teamId = selectedTeam.id;
      season = Basketball[league].seasons.sort(function(a,b) {
        if (a.season < b.season) {
          return 1;
        } else {
          return -1;
        }
      })[0].season;
      nextGame = await processBasketball(leagueId, teamId, season);
    } else if (sport == 'soccer') { // use fixtures route
      leagueId = Soccer[league].id;
      const selectedTeam = Soccer[league]['teams'].find(x => x.name == team);
      if (!selectedTeam) {
        return interaction.followUp(`${team} was not found in the ${league} league, please make sure you chose the correct team and league.`);
      }
      teamId = selectedTeam.id;
      season = Soccer[league].seasons.sort(function(a,b) {
        if (a.year < b.year) {
          return 1;
        } else {
          return -1;
        }
      })[0].year;
      nextGame = await processSoccer(leagueId, teamId, season);
    } else if (sport == 'football') {
      leagueId = Football[league].id;
      const selectedTeam = Football[league]['teams'].find(x => x.name == team);
      if (!selectedTeam) {
        return interaction.followUp(`${team} was not found in the ${league} league, please make sure you chose the correct team and league.`);
      }
      teamId = selectedTeam.id;
      season = Football[league].seasons.sort(function(a,b) {
        if (a.year < b.year) {
          return 1;
        } else {
          return -1;
        }
      })[0].year;
      nextGame = await processFootball(leagueId, teamId, season);
    } else if (sport == 'baseball') {
      leagueId = Baseball[league].id;
      const selectedTeam = Baseball[league]['teams'].find(x => x.name == team);
      if (!selectedTeam) {
        return interaction.followUp(`${team} was not found in the ${league} league, please make sure you chose the correct team and league.`);
      }
      teamId = selectedTeam.id;
      season = Baseball[league].seasons.sort(function(a,b) {
        if (a.season < b.season) {
          return 1;
        } else {
          return -1;
        }
      })[0].season;
      nextGame = await processBaseball(leagueId, teamId, season);
    } else if (sport == 'hockey') {
      leagueId = Hockey[league].id;
      const selectedTeam = Hockey[league]['teams'].find(x => x.name == team);
      if (!selectedTeam) {
        return interaction.followUp(`${team} was not found in the ${league} league, please make sure you chose the correct team and league.`);
      }
      teamId = selectedTeam.id;
      season = Hockey[league].seasons.sort(function(a,b) {
        if (a.season < b.season) {
          return 1;
        } else {
          return -1;
        }
      })[0].season;
      nextGame = await processHockey(leagueId, teamId, season);
    }
    if (!nextGame) {
      return interaction.followUp(`No upcoming game could be found for ${team}.`)
    }
    // this is probably gonna have to change a little as well
    const embed = new EmbedBuilder()
      .setTitle(`${team}'s Next Game: ${nextGame.awayTeam} at ${nextGame.homeTeam} on ${nextGame.when}`)
      .setAuthor({ name: `${league}`, iconURL: `${nextGame.leagueLogo}`})
      .setImage(`attachment://${nextGame.fileName}`)
      .setFooter({ text: `Possible thanks to ${nextGame.api}`})
    await interaction.followUp({ embeds: [embed], files: [{ attachment: nextGame.outputPath, name: `${nextGame.fileName}`}]});
  },
  async autocomplete(interaction) {
    return sportsAutocomplete(interaction);
  }
}


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
  const outputPath = `../../next${sport}event.png`;
  await canvas.writeAsync(outputPath);
  return { outputPath: outputPath, fileName: `next${sport}event.png`}
}

async function processBasketball(leagueId, teamId, season) {
  const config = {
    method: 'GET',
    url: `https://v1.basketball.api-sports.io/games?league=${leagueId}&team=${teamId}&season=${season}`,
    headers: {
      'x-rapidapi-key': process.env.SPORTSAPIKEY,
      'x-rapidapi-host': `v1.basketball.api-sports.io`
    }
  };

  const { response } = await axios(config).then(res => res.data);
  const futureGames = response.filter(x => x.status.short == 'NS');
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

  const imageResult = await createImage(homeImage, awayImage, 'basketball');

  return { awayTeam: nextGame.teams.away.name,
    homeTeam: nextGame.teams.home.name,
    when: new Date(nextGame.timestamp * 1000).toLocaleString(),
    leagueLogo: nextGame.league.logo,
    outputPath: imageResult.outputPath,
    fileName: imageResult.fileName,
    api: 'api-basketball.com' }
}

async function processFootball(leagueId, teamId, season) {
  const config = {
    method: 'GET',
    url: `https://v1.american-football.api-sports.io/games?league=${leagueId}&team=${teamId}&season=${season}`,
    headers: {
      'x-rapidapi-host': 'v1.american-football.api-sports.io',
      'x-rapidapi-key': process.env.SPORTSAPIKEY
    }
  };

  const { response } = await axios(config).then(res => res.data);
  const futureGames = response.filter(x => x.game.status.short == 'NS');

  if (futureGames && futureGames.length < 1) {
    return;
  }
  const nextGame = futureGames.sort(function(a,b) {
    if (a.game.date.timestamp < b.game.date.timestamp) {
      return -1;
    } else {
      return 1;
    }
  })[0];


  const homeImage = await downloadImage(nextGame.teams.home.logo)
  const awayImage = await downloadImage(nextGame.teams.away.logo);

  const imageResult = await createImage(homeImage, awayImage, 'soccer');

  return { awayTeam: nextGame.teams.away.name,
    homeTeam: nextGame.teams.home.name,
    when: new Date(nextGame.game.date.timestamp * 1000).toLocaleString(),
    leagueLogo: nextGame.league.logo,
    outputPath: imageResult.outputPath,
    fileName: imageResult.fileName,
    api: 'api-american-football.com' }
}

async function processSoccer(leagueId, teamId, season) {
  const config = {
    method: 'GET',
    url: `https://v3.football.api-sports.io/fixtures?league=${leagueId}&team=${teamId}&season=${season}`,
    headers: {
      'x-rapidapi-host': 'v3.football.api-sports.io',
      'x-rapidapi-key': process.env.SPORTSAPIKEY
    }
  };
  const { response } = await axios(config).then(res => res.data);
  const futureGames = response.filter(x => x.fixture.status.short == 'NS');
  if (futureGames && futureGames.length < 1) {
    return;
  }
  const nextGame = futureGames.sort(function(a,b) {
    if(a.fixture.timestamp < b.fixture.timestamp) {
      return -1;
    } else {
      return 1;
    }
  })[0];

  const homeImage = await downloadImage(nextGame.teams.home.logo)
  const awayImage = await downloadImage(nextGame.teams.away.logo);

  const imageResult = await createImage(homeImage, awayImage, 'soccer');

  return { awayTeam: nextGame.teams.away.name,
    homeTeam: nextGame.teams.home.name,
    when: new Date(nextGame.fixture.timestamp * 1000).toLocaleString(),
    leagueLogo: nextGame.league.logo,
    outputPath: imageResult.outputPath,
    fileName: imageResult.fileName,
    api: 'api-football.com' }
}

async function processBaseball(leagueId, teamId, season) {
  const config = {
    method: 'GET',
    url: `https://v1.baseball.api-sports.io/games?league=${leagueId}&team=${teamId}&season=${season}`,
    headers: {
      'x-rapidapi-key': process.env.SPORTSAPIKEY,
      'x-rapidapi-host': 'v1.baseball.api-sports.io'
    }
  };

  const { response } = await axios(config).then(res => res.data);

  const futureGames = response.filter(x => x.status.short == 'NS');
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
    api: 'api-baseball.com' }
}

// TODO: Hockey, Basketball, and Baseball have the same flow so possible optimization here.
async function processHockey(leagueId, teamId, season) {
  const config = {
    method: 'GET',
    url: `https://v1.hockey.api-sports.io/games?league=${leagueId}&team=${teamId}&season=${season}`,
    headers: {
      'x-rapidapi-host': 'v1.hockey.api-sports.io',
      'x-rapidapi-key': process.env.SPORTSAPIKEY
    }
  };
  const { response } = await axios(config).then(res => res.data);

  const futureGames = response.filter(x => x.status.short == 'NS');
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
}
