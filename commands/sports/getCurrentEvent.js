const { EmbedBuilder } = require('discord.js');
const Basketball = require('../../sportsData/Basketball.json');
const Football = require('../../sportsData/Football.json');
const Baseball = require('../../sportsData/Baseball.json');
const Hockey = require('../../sportsData/Hockey.json');
const Soccer = require('../../sportsData/Soccer.json')
const sportsAutocomplete = require('./common/autocomplete.js')
const commandDef = require('./common/commandDef.js');
const processSport = require('./common/processSport.js')


module.exports = {
  cooldown: 30,
  data: commandDef('getcurrentevent', 'get the current score for the ongoing match for the given team'),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const league = interaction.options.getString('league');
    const team = interaction.options.getString('team');
    const sport = interaction.options._subcommand;
    const status = null;
    let leagueId = '';
    let teamId = '';
    let season = '';
    let currentGame = null;
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
      currentGame = await processSport.processBasketball(config, status);
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
      currentGame = await processSport.processSoccer(config, status);
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
      currentGame = await processSport.processFootball(config, status);
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
      currentGame = await processSport.processBaseball(config, status);
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
      currentGame = await processSport.processHockey(config, status);
    }
    if (!currentGame) {
      return interaction.followUp(`No upcoming game could be found for ${team}.`)
    }
    // this should have round breakdowns, but current score is easer to implement
    const embed = new EmbedBuilder()
      .setTitle(`${team}'s Current Game: ${currentGame.awayTeam} at ${currentGame.homeTeam} happening now ${currentGame.status.long}`)
      .setAuthor({ name: `${league}`, iconURL: `${currentGame.leagueLogo}`})
      .addFields(
        { name: `${currentGame.awayTeam}`, value: `${currentGame.scores.away}`, inline: true },
        { name: '\u200b', value: '\u200b', inline: true },
        { name: `${currentGame.homeTeam}`, value: `${currentGame.scores.home}`, inline: true }
      )
      .setImage(`attachment://${currentGame.fileName}`)
      .setFooter({ text: `Possible thanks to ${currentGame.api}`})
    await interaction.followUp({ embeds: [embed], files: [{ attachment: currentGame.outputPath, name: `${currentGame.fileName}`}]});
  },
  async autocomplete(interaction) {
    return sportsAutocomplete(interaction);
  }
}