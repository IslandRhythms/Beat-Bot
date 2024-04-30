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
  data: commandDef('getrecentevent', 'get the most recent game for the given team'),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const league = interaction.options.getString('league');
    const team = interaction.options.getString('team');
    const sport = interaction.options._subcommand;
    let leagueId = '';
    let teamId = '';
    let season = '';
    let recentGame = null;
    // status must be declared per sport
    if (sport == 'basketball') {
      const status = ['FT', 'AOT']
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
      recentGame = await processSport.processBasketball(config, status);
    } else if (sport == 'soccer') { // use fixtures route
      const status = ['FT', 'PEN', 'AET'];
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
      recentGame = await processSport.processSoccer(config, status);
    } else if (sport == 'football') {
      const status = ['FT', 'AOT'];
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
      recentGame = await processSport.processFootball(config, status);
    } else if (sport == 'baseball') {
      const status = 'FT';
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
      recentGame = await processSport.processBaseball(config, status);
    } else if (sport == 'hockey') {
      const status = ['FT', 'AOT', 'AP'];
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
      recentGame = await processSport.processHockey(config, status);
    }
    if (!recentGame) {
      return interaction.followUp(`No upcoming game could be found for ${team}.`)
    }
    // this is probably gonna have to change a little as well
    // Need to decide whether to show current score or current score as well as the past scores before this point
    // just current score is easier I think
    const winner = recentGame.scores.away.total > recentGame.scores.home.total ? `The ${recentGame.awayTeam} Won!` : `The ${recentGame.homeTeam} Won!`;
    console.log('what is recentGame', recentGame);
    const embed = new EmbedBuilder()
      .setTitle(`${team}'s Recent Game: ${recentGame.awayTeam} at ${recentGame.homeTeam}. ${winner}`)
      .setAuthor({ name: `${league}`, iconURL: `${recentGame.leagueLogo}`})
      .setImage(`attachment://${recentGame.fileName}`)
      .setFooter({ text: `Possible thanks to ${recentGame.api}`})
      .addFields(
        { name: `${recentGame.awayTeam}`, value: `${recentGame.scores.away.total}`, inline: true },
        { name: '\u200b', value: '\u200b', inline: true },
        { name: `${recentGame.homeTeam}`, value: `${recentGame.scores.home.total}`, inline: true }
      )
    await interaction.followUp({ embeds: [embed], files: [{ attachment: recentGame.outputPath, name: `${recentGame.fileName}`}]});
  },
  async autocomplete(interaction) {
    return sportsAutocomplete(interaction);
  }
}