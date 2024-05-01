const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const commandDef = require('./common/commandDef');
const sportsAutocomplete = require('./common/autocomplete');
const Basketball = require('../../sportsData/Basketball.json');
const Football = require('../../sportsData/Football.json');
const Baseball = require('../../sportsData/Baseball.json');
const Hockey = require('../../sportsData/Hockey.json');
const Soccer = require('../../sportsData/Soccer.json')

module.exports = {
  data: commandDef('schedule', 'Get your sports team\'s schedule for the year.'),
  async autocomplete(interaction) {
    return sportsAutocomplete(interaction);
  },
  async execute(interaction) {
    await interaction.deferReply();
    let sport = interaction.options._subcommand;
    if (sport == 'football') {
      sport = 'american-football'
    } else if (sport == 'soccer') {
      sport = 'football';
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

    const sportsFunctions = {
      basketball: processBasketball,
      baseball: processBaseball,
      hockey: processHockey,
      'american-football': processFootball,
      football: processSoccer
    }

    const embed = sportsFunctions[sport](games);
    await interaction.followUp('Under Construction');
  }
}

function processBasketball(games) {

}

function processBaseball(games) {
  
}

function processHockey(games) {
  
}

function processFootball(games) {
  
}

function processSoccer(games) {
  
}