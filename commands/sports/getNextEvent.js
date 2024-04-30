const { EmbedBuilder } = require('discord.js');
const Basketball = require('../../sportsData/Basketball.json');
const Football = require('../../sportsData/Football.json');
const Baseball = require('../../sportsData/Baseball.json');
const Hockey = require('../../sportsData/Hockey.json');
const Soccer = require('../../sportsData/Soccer.json')
const sportsAutocomplete = require('./common/autocomplete.js')
const commandDef = require('./common/commandDef.js');
const processSport = require('./common/processSport.js');

module.exports = {
  cooldown: 30,
  data: commandDef('getnextevent', 'get the next game for the indicated team'),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const league = interaction.options.getString('league');
    const team = interaction.options.getString('team');
    const sport = interaction.options._subcommand;
    const status = 'NS'; // can declare status here since this is consistent across all sports
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

      const config = {
        method: 'GET',
        url: `https://v1.basketball.api-sports.io/games?league=${leagueId}&team=${teamId}&season=${season}`,
        headers: {
          'x-rapidapi-key': process.env.SPORTSAPIKEY,
          'x-rapidapi-host': `v1.basketball.api-sports.io`
        }
      };
      nextGame = await processSport.processBasketball(config, status);
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

      const config = {
        method: 'GET',
        url: `https://v3.football.api-sports.io/fixtures?league=${leagueId}&team=${teamId}&season=${season}`,
        headers: {
          'x-rapidapi-host': 'v3.football.api-sports.io',
          'x-rapidapi-key': process.env.SPORTSAPIKEY
        }
      };
      nextGame = await processSport.processSoccer(config, status);
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

      const config = {
        method: 'GET',
        url: `https://v1.american-football.api-sports.io/games?league=${leagueId}&team=${teamId}&season=${season}`,
        headers: {
          'x-rapidapi-host': 'v1.american-football.api-sports.io',
          'x-rapidapi-key': process.env.SPORTSAPIKEY
        }
      };
      nextGame = await processSport.processFootball(config, status);
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

      const config = {
        method: 'GET',
        url: `https://v1.baseball.api-sports.io/games?league=${leagueId}&team=${teamId}&season=${season}`,
        headers: {
          'x-rapidapi-key': process.env.SPORTSAPIKEY,
          'x-rapidapi-host': 'v1.baseball.api-sports.io'
        }
      };    
      nextGame = await processSport.processBaseball(config, status);
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

      const config = {
        method: 'GET',
        url: `https://v1.hockey.api-sports.io/games?league=${leagueId}&team=${teamId}&season=${season}`,
        headers: {
          'x-rapidapi-host': 'v1.hockey.api-sports.io',
          'x-rapidapi-key': process.env.SPORTSAPIKEY
        }
      };
      nextGame = await processSport.processHockey(config, status);
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


