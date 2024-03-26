const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const Basketball = require('../../sportsData/Basketball.json');
const Football = require('../../sportsData/Football.json');
const Baseball = require('../../sportsData/Baseball.json');
const Hockey = require('../../sportsData/Hockey.json');
const Soccer = require('../../sportsData/Soccer.json')
const Jimp = require('jimp');

module.exports = {
  cooldown: 30,
  data: new SlashCommandBuilder().setName('getnextevent')
  .setDescription('get the next event for the indicated team')
  .addSubcommand(subcommand =>
    subcommand.setName('basketball').setDescription('basketball')
      .addStringOption(option =>
        option.setName('league').setDescription('the league (nba, ncaa)').setRequired(true).addChoices(
          { name: 'NBA', value: 'NBA' },
          { name: 'NCAA', value: 'NCAA' }
        ))
      .addStringOption(option =>
        option.setName('team').setDescription('the name of the team').setRequired(true).setAutocomplete(true)))
  .addSubcommand(subcommand => 
    subcommand.setName('football').setDescription('american football')
    .addStringOption(option =>
      option.setName('league').setDescription('the league (nfl, ncaa)').setRequired(true).addChoices(
        { name: 'NFL', value: 'NFL' },
        { name: 'NCAA', value: 'NFL' }
      ))
      .addStringOption(option =>
        option.setName('team').setDescription('the name of the team').setRequired(true).setAutocomplete(true)))
  .addSubcommand(subcommand => 
    subcommand.setName('baseball').setDescription('baseball')
    .addStringOption(option =>
      option.setName('league').setDescription('the league (mlb)').setRequired(true).addChoices(
        { name: 'MLB', value: 'MLB' },
        // { name: 'NCAA', value: 'NCAA' }
      ))
      .addStringOption(option =>
        option.setName('team').setDescription('the name of the team').setRequired(true).setAutocomplete(true)))
  .addSubcommand(subcommand => 
    subcommand.setName('hockey').setDescription('hockey')
    .addStringOption(option =>
      option.setName('league').setDescription('the league (nhl, ncaa)').setRequired(true).addChoices(
        { name: 'NHL', value: 'NHL' },
        { name: 'NCAA', value: 'NCAA' }
      ))
      .addStringOption(option =>
        option.setName('team').setDescription('the name of the team').setRequired(true).setAutocomplete(true)))
  .addSubcommand(subcommand => 
    subcommand.setName('soccer').setDescription('internationally known as football')
    .addStringOption(option =>
      option.setName('league').setDescription('the league').setRequired(true).addChoices(
        { name: 'Bundesliga', value: 'Bundesliga' },
        { name: 'La Liga', value: 'La Liga' },
        { name: 'Serie A', value: 'Serie A' },
        { name: 'Premiere League (UK)', value: 'Premiere League' }
      ))
      .addStringOption(option =>
        option.setName('team').setDescription('the name of the team').setRequired(true).setAutocomplete(true))),
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
    // this is probably gonna have to change a little as well
    const embed = new EmbedBuilder()
      .setTitle(`${team}'s Next Game: ${nextGame.awayTeam} at ${nextGame.homeTeam} on ${nextGame.when}`)
      .setAuthor({ name: `${league}`, iconURL: `${nextGame.leagueLogo}`})
      .setImage(`attachment://${nextGame.fileName}`)
      .setFooter({ text: `Possible thanks to ${nextGame.api}`})
    await interaction.followUp({ embeds: [embed], files: [{ attachment: nextGame.outputPath, name: `${nextGame.fileName}`}]});
  },
  async autocomplete(interaction) {
    let focusedValue = interaction.options.getFocused(true);
    // initial whitespace is causing it to send all results which results in a crash since limit is 25
    if (focusedValue.value == '') {
      focusedValue = null;
    } else {
      focusedValue = focusedValue.value.toLowerCase();
    }
    const sport = interaction.options._subcommand;
    let teams = [];
    // if league is not provided, it needs to list all teams in both leagues.
    if (sport == 'basketball') {
      const keys = Object.keys(Basketball);
      for (let i = 0; i < keys.length; i++) {
        teams = teams.concat(Basketball[keys[i]].teams)
      }
    } else if (sport == 'football') {
      const keys = Object.keys(Football);
      for (let i = 0; i < keys.length; i++) {
        teams = teams.concat(Football[keys[i]].teams)
      }
    } else if (sport == 'hockey') {
      const keys = Object.keys(Hockey);
      for (let i = 0; i < keys.length; i++) {
        teams = teams.concat(Hockey[keys[i]].teams)
      }
    } else if (sport == 'baseball') {
      const keys = Object.keys(Baseball);
      for (let i = 0; i < keys.length; i++) {
        teams = teams.concat(Baseball[keys[i]].teams)
      }
    } else if (sport == 'soccer') {
      const keys = Object.keys(Soccer);
      for (let i = 0; i < keys.length; i++) {
        teams = teams.concat(Soccer[keys[i]].teams)
      }
    } else if (sport == 'formula 1') {

    }

		let filtered = teams.filter(choice => choice.name.toLowerCase().includes(focusedValue));
    if (filtered.length > 25) {
      filtered = filtered.slice(0, 25);
    }
		await interaction.respond(
			filtered.map(choice => ({ name: choice.name, value: choice.name })),
		);
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

}

async function processHockey(leagueId, teamId, season) {

}
