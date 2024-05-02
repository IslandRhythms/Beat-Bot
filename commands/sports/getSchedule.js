const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { Pagination } = require('pagination.djs');
const commandDef = require('./common/commandDef');
const sportsAutocomplete = require('./common/autocomplete');
const sportsData = {
  basketball: require('../../sportsData/Basketball.json'),
  football: require('../../sportsData/Football.json'),
  soccer: require('../../sportsData/Soccer.json'),
  hockey: require('../../sportsData/Hockey.json'),
  baseball: require('../../sportsData/Baseball.json')
};

const { downloadImage, createImage } = require('./common/processSport');

module.exports = {
  data: commandDef('schedule', 'Get your sports team\'s schedule for the year.'),
  async autocomplete(interaction) {
    return sportsAutocomplete(interaction);
  },
  async execute(interaction) {
    const pagination = new Pagination(interaction);
    await interaction.deferReply();
    let sport = interaction.options._subcommand;
    let teamId = '';
    let season = '';
    const league = interaction.options.getString('league');
    const team = interaction.options.getString('team');
    const leagueId = sportsData[sport][league].id;
    const selectedTeam = sportsData[sport][league]['teams'].find(x => x.name == team);
    if (!selectedTeam) {
      return interaction.followUp(`${team} was not found in the ${league} league, please make sure you chose the correct team and league.`);
    }
    teamId = selectedTeam.id;
    const image = selectedTeam.logo;
    if (sport == 'football') {
      season = sportsData[sport][league].seasons.sort(function(a,b) {
        if (a.year < b.year) {
          return 1;
        } else {
          return -1;
        }
      })[0].year;
      sport = 'american-football'
    } else if (sport == 'soccer') {
      season = sportsData[sport][league].seasons.sort(function(a,b) {
        if (a.year < b.year) {
          return 1;
        } else {
          return -1;
        }
      })[0].year;
      sport = 'football';
    } else {
      season = sportsData[sport][league].seasons.sort(function(a,b) {
        if (a.season < b.season) {
          return 1;
        } else {
          return -1;
        }
      })[0].season;
    }

    const config = {
      method: 'GET',
      url: `https://v1.${sport}.api-sports.io/games?league=${leagueId}&team=${teamId}&season=${season}`,
      headers: {
        'x-rapidapi-key': process.env.SPORTSAPIKEY,
        'x-rapidapi-host': `v1.${sport}.api-sports.io`
      }
    };

    const { response } = await axios(config).then(res => res.data);

    const games = response.sort(function(a,b) {
      if(a.timestamp < b.timestamp) {
        return -1;
      } else {
        return 1;
      }
    });
    console.log('how many games?', games.length);
    const sportsFunctions = {
      basketball: processBasketball,
      baseball: processBaseball,
      hockey: processHockey,
      'american-football': processFootball,
      football: processSoccer
    }

    const embeds = sportsFunctions[sport](games);
    /*
    pagination.setEmbeds(embeds, (embed, index, array) => {
      return embed.setTitle(``).setImage(image);
    });
    */
    await interaction.followUp('Under Construction');
  }
}

async function processBasketball(games) {
  const embeds = [];
  const finished = ['FT', 'AOT'];
  let month = new Date(games[0].timestamp * 1000).getMonth();
  const fields = [];
  
  for (let i = 0; i < games.length; i++) {
    const gameDate = new Date(games[i].timestamp * 1000);
    const gameMonth = gameDate.getMonth();
    const game = games[i];
    
    if (gameMonth != month) {
      const embed = new EmbedBuilder().setTitle();
      embed.addFields(...fields);
      embeds.push(embed);
      fields.length = 0;
      month = gameMonth;
    }
    
    if (game.status.short == 'NS') { // not started
      fields.push({ name: `Away`, value: `${game.teams.away.name}`, inline: true }, { name: `At`, value: `${gameDate.toLocaleDateString()}`, inline: true }, { name: `Home`, value: `${game.teams.home.name}`, inline: true });
    } else if (finished.includes(game.status.short)) { // finished
      const winner = game.scores.away.total > game.scores.home.total ? `${game.teams.away.name} Won!` : `${game.teams.home.name} Won!`;
      // note: see if emojis work on embed inline fields. If so, put a trophy next to the winning score or team.
      fields.push({ name: `Away`, value: `${game.teams.away.name}`, inline: true }, { name: `At ${gameDate.toLocaleDateString()}`, value: `${game.scores.away.total} - ${game.scores.home.total}`, inline: true }, { name: `Home`, value: `${game.teams.home.name}`, inline: true });
    } else { // in progress
      fields.push({ name: ``, value: ``, inline: true }, { name: ``, value: ``, inline: true }, { name: ``, value: ``, inline: true });
    }
    
    // Check if it's the last iteration
    if (i === games.length - 1) {
      const embed = new EmbedBuilder().setTitle();
      embed.addFields(...fields);
      embeds.push(embed);
    }
  }
}

function processBaseball(games) {
  
}

function processHockey(games) {
  
}

function processFootball(games) {
  
}

function processSoccer(games) {
  
}