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

module.exports = {
  data: commandDef('schedule', 'Get your sports team\'s schedule for the year.'),
  async autocomplete(interaction) {
    return sportsAutocomplete(interaction);
  },
  async execute(interaction) {
    const pagination = new Pagination(interaction);
    await interaction.deferReply({ ephemeral: true });
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
    if (sport == 'football') { // soccer
      config.url = `https://v3.${sport}.api-sports.io/fixtures?league=${leagueId}&team=${teamId}&season=${season}`;
      config.headers['x-rapidapi-host'] = `v3.${sport}.api-sports.io`;
    }
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

    const embeds = sportsFunctions[sport](games);
    pagination.setEmbeds(embeds, (embed, index, array) => {
      embed.data.title = `${selectedTeam.name}'s Schedule for the month of ` + embed.data.title;
      embed.setFooter({ text: `Page: ${index + 1}/${array.length}`})
      return embed.setImage(image);
    });
    pagination.render();
    // await interaction.followUp('Under Construction');
  }
}

function processBasketball(games) {
  const embeds = [];
  const finished = ['FT', 'AOT'];
  let current = new Date(games[0].timestamp * 1000);
  // const fields = [];
  let description = '\n';
  for (let i = 0; i < games.length; i++) {
    const gameDate = new Date(games[i].timestamp * 1000);
    const gameMonth = gameDate.getMonth();
    const game = games[i];
    if (gameMonth != current.getMonth()) {
      const embed = new EmbedBuilder().setTitle(`${current.toLocaleString('en-us', { month: 'long' } )}`).setDescription(description);
      description = '\n';
      // embed.addFields(...fields);
      embeds.push(embed);
      // fields.length = 0;
      current = gameDate;
    }
    
    if (game.status.short == 'NS') { // not started
      // fields.push({ name: `Away`, value: `${game.teams.away.name}`, inline: true }, { name: `At`, value: `${gameDate.toLocaleDateString()}`, inline: true }, { name: `Home`, value: `${game.teams.home.name}`, inline: true });
      description += `${game.teams.away.name} at ${game.teams.home.name} on ${gameDate.toLocaleDateString()}\n`;
    } else if (finished.includes(game.status.short)) { // finished
      // fields.push({ name: `Away`, value: `${game.scores.away.total > game.scores.home.total ? ':trophy:' : ''} ${game.teams.away.name}`, inline: true }, { name: `At ${gameDate.toLocaleDateString()}`, value: `${game.scores.away.total} - ${game.scores.home.total}`, inline: true }, { name: `Home`, value: `${game.teams.home.name} ${game.scores.home.total > game.scores.away.total ? ':trophy:' : ''}`, inline: true });
      description += `${game.scores.away.total > game.scores.home.total ? ':trophy:' : ''} ${game.teams.away.name} at ${game.teams.home.name} ${game.scores.home.total > game.scores.away.total ? ':trophy:' : ''} on ${gameDate.toLocaleDateString()} ${game.scores.away.total} - ${game.scores.home.total}\n`;
    } else { // in progress
      // fields.push({ name: `test`, value: `test`, inline: true }, { name: `test`, value: `test`, inline: true }, { name: `test`, value: `test`, inline: true });
      description += `${game.teams.away.name} at ${game.teams.home.name} LIVE ${game.scores.away.total} - ${game.scores.home.total}\n`;
    }
    
    // Check if it's the last iteration
    if (i === games.length - 1) {
      const embed = new EmbedBuilder().setTitle(`${gameDate.toLocaleString('en-us', { month: 'long' } )}`);
      embed.setDescription(description);
      // embed.addFields(...fields);
      embeds.push(embed);
    }
  }
  return embeds;
}

function processBaseball(games) {
  const embeds = [];
  let current = new Date(games[0].timestamp * 1000);
  const other = ['CANC', 'POST', 'INTR', 'ABD']
  // const fields = [];
  let description = '\n';
  for (let i = 0; i < games.length; i++) {
    const gameDate = new Date(games[i].timestamp * 1000);
    const gameMonth = gameDate.getMonth();
    const game = games[i];
    if (gameMonth != current.getMonth()) {
      const embed = new EmbedBuilder().setTitle(`${current.toLocaleString('en-us', { month: 'long' } )}`).setDescription(description);
      description = '\n';
      // embed.addFields(...fields);
      embeds.push(embed);
      // fields.length = 0;
      current = gameDate;
    }
    if (game.status.short == 'NS') { // not started
      // fields.push({ name: `Away`, value: `${game.teams.away.name}`, inline: true }, { name: `At`, value: `${gameDate.toLocaleDateString()}`, inline: true }, { name: `Home`, value: `${game.teams.home.name}`, inline: true });
      description += `${game.teams.away.name} at ${game.teams.home.name} on ${gameDate.toLocaleDateString()}\n`;
    } else if (game.status.short == 'FT') { // finished
      // fields.push({ name: `Away`, value: `${game.scores.away.total > game.scores.home.total ? ':trophy:' : ''} ${game.teams.away.name}`, inline: true }, { name: `At ${gameDate.toLocaleDateString()}`, value: `${game.scores.away.total} - ${game.scores.home.total}`, inline: true }, { name: `Home`, value: `${game.teams.home.name} ${game.scores.home.total > game.scores.away.total ? ':trophy:' : ''}`, inline: true });
      description += `${game.scores.away.total > game.scores.home.total ? ':trophy:' : ''} ${game.teams.away.name} at ${game.teams.home.name} ${game.scores.home.total > game.scores.away.total ? ':trophy:' : ''} on ${gameDate.toLocaleDateString()} ${game.scores.away.total} - ${game.scores.home.total}\n`;
    } else if (other.includes(game.status.short)) {
      description += `${game.teams.away.name} at ${game.teams.home.name} on ${gameDate.toLocaleDateString()} status ${game.status.long}\n`;
    } else { // in progress
      // fields.push({ name: `test`, value: `test`, inline: true }, { name: `test`, value: `test`, inline: true }, { name: `test`, value: `test`, inline: true });
      description += `${game.teams.away.name} at ${game.teams.home.name} LIVE ${game.scores.away.total} - ${game.scores.home.total}\n`;
    }
    
    // Check if it's the last iteration
    if (i === games.length - 1) {
      const embed = new EmbedBuilder().setTitle(`${gameDate.toLocaleString('en-us', { month: 'long' } )}`);
      embed.setDescription(description);
      // embed.addFields(...fields);
      embeds.push(embed);
    }
  }
  return embeds;
}
function processHockey(games) {
  const embeds = [];
  let current = new Date(games[0].timestamp * 1000);
  const finished = ['FT', 'AOT', 'AP'];
  // const fields = [];
  let description = '\n';
  for (let i = 0; i < games.length; i++) {
    const gameDate = new Date(games[i].timestamp * 1000);
    const gameMonth = gameDate.getMonth();
    const game = games[i];
    if (gameMonth != current.getMonth()) {
      const embed = new EmbedBuilder().setTitle(`${current.toLocaleString('en-us', { month: 'long' } )}`).setDescription(description);
      description = '\n';
      // embed.addFields(...fields);
      embeds.push(embed);
      // fields.length = 0;
      current = gameDate;
    }
    
    if (game.status.short == 'NS') { // not started
      // fields.push({ name: `Away`, value: `${game.teams.away.name}`, inline: true }, { name: `At`, value: `${gameDate.toLocaleDateString()}`, inline: true }, { name: `Home`, value: `${game.teams.home.name}`, inline: true });
      description += `${game.teams.away.name} at ${game.teams.home.name} on ${gameDate.toLocaleDateString()}\n`;
    } else if (finished.includes(game.status.short)) { // finished
      // fields.push({ name: `Away`, value: `${game.scores.away.total > game.scores.home.total ? ':trophy:' : ''} ${game.teams.away.name}`, inline: true }, { name: `At ${gameDate.toLocaleDateString()}`, value: `${game.scores.away.total} - ${game.scores.home.total}`, inline: true }, { name: `Home`, value: `${game.teams.home.name} ${game.scores.home.total > game.scores.away.total ? ':trophy:' : ''}`, inline: true });
      description += `${game.scores.away > game.scores.home ? ':trophy:' : ''} ${game.teams.away.name} at ${game.teams.home.name} ${game.scores.home > game.scores.away ? ':trophy:' : ''} on ${gameDate.toLocaleDateString()} ${game.scores.away} - ${game.scores.home}\n`;
    } else { // in progress
      // fields.push({ name: `test`, value: `test`, inline: true }, { name: `test`, value: `test`, inline: true }, { name: `test`, value: `test`, inline: true });
      description += `${game.teams.away.name} at ${game.teams.home.name} LIVE ${game.scores.away} - ${game.scores.home}\n`;
    }
    
    // Check if it's the last iteration
    if (i === games.length - 1) {
      const embed = new EmbedBuilder().setTitle(`${gameDate.toLocaleString('en-us', { month: 'long' } )}`);
      embed.setDescription(description);
      // embed.addFields(...fields);
      embeds.push(embed);
    }
  }
  return embeds;
}

function processFootball(games) {
  const embeds = [];
  const finished = ['FT', 'AOT'];
  let current = new Date(games[0].game.date.timestamp * 1000);
  // const fields = [];
  let description = '\n';
  for (let i = 0; i < games.length; i++) {
    const gameDate = new Date(games[i].game.date.timestamp * 1000);
    const gameMonth = gameDate.getMonth();
    const game = games[i];
    if (gameMonth != current.getMonth()) {
      const embed = new EmbedBuilder().setTitle(`${current.toLocaleString('en-us', { month: 'long' } )}`).setDescription(description);
      description = '\n';
      // embed.addFields(...fields);
      embeds.push(embed);
      // fields.length = 0;
      current = gameDate;
    }
    
    if (game.game.status.short == 'NS') { // not started
      // fields.push({ name: `Away`, value: `${game.teams.away.name}`, inline: true }, { name: `At`, value: `${gameDate.toLocaleDateString()}`, inline: true }, { name: `Home`, value: `${game.teams.home.name}`, inline: true });
      description += `${game.teams.away.name} at ${game.teams.home.name} on ${gameDate.toLocaleDateString()}\n`;
    } else if (finished.includes(game.game.status.short)) { // finished
      // fields.push({ name: `Away`, value: `${game.scores.away.total > game.scores.home.total ? ':trophy:' : ''} ${game.teams.away.name}`, inline: true }, { name: `At ${gameDate.toLocaleDateString()}`, value: `${game.scores.away.total} - ${game.scores.home.total}`, inline: true }, { name: `Home`, value: `${game.teams.home.name} ${game.scores.home.total > game.scores.away.total ? ':trophy:' : ''}`, inline: true });
      description += `${game.scores.away.total > game.scores.home.total ? ':trophy:' : ''} ${game.teams.away.name} at ${game.teams.home.name} ${game.scores.home.total > game.scores.away.total ? ':trophy:' : ''} on ${gameDate.toLocaleDateString()} ${game.scores.away.total} - ${game.scores.home.total}\n`;
    } else { // in progress
      // fields.push({ name: `test`, value: `test`, inline: true }, { name: `test`, value: `test`, inline: true }, { name: `test`, value: `test`, inline: true });
      description += `${game.teams.away.name} at ${game.teams.home.name} LIVE ${game.scores.away.total} - ${game.scores.home.total}\n`;
    }
    
    // Check if it's the last iteration
    if (i === games.length - 1) {
      const embed = new EmbedBuilder().setTitle(`${gameDate.toLocaleString('en-us', { month: 'long' } )}`);
      embed.setDescription(description);
      // embed.addFields(...fields);
      embeds.push(embed);
    }
  }
  return embeds;
}

function processSoccer(games) {
  const embeds = [];
  const finished = ['FT', 'PEN', 'AET'];
  let current = new Date(games[0].fixture.timestamp * 1000);
  // const fields = [];
  let description = '\n';
  for (let i = 0; i < games.length; i++) {
    const gameDate = new Date(games[i].fixture.timestamp * 1000);
    const gameMonth = gameDate.getMonth();
    const game = games[i];
    if (gameMonth != current.getMonth()) {
      const embed = new EmbedBuilder().setTitle(`${current.toLocaleString('en-us', { month: 'long' } )}`).setDescription(description);
      description = '\n';
      // embed.addFields(...fields);
      embeds.push(embed);
      // fields.length = 0;
      current = gameDate;
    }
    if (game.fixture.status.short == 'NS') { // not started
      // fields.push({ name: `Away`, value: `${game.teams.away.name}`, inline: true }, { name: `At`, value: `${gameDate.toLocaleDateString()}`, inline: true }, { name: `Home`, value: `${game.teams.home.name}`, inline: true });
      description += `${game.teams.away.name} at ${game.teams.home.name} on ${gameDate.toLocaleDateString()}\n`;
    } else if (finished.includes(game.fixture.status.short)) { // finished, also fyi it is possible to tie in soccer
      // fields.push({ name: `Away`, value: `${game.scores.away.total > game.scores.home.total ? ':trophy:' : ''} ${game.teams.away.name}`, inline: true }, { name: `At ${gameDate.toLocaleDateString()}`, value: `${game.scores.away.total} - ${game.scores.home.total}`, inline: true }, { name: `Home`, value: `${game.teams.home.name} ${game.scores.home.total > game.scores.away.total ? ':trophy:' : ''}`, inline: true });
      description += `${game.goals.away > game.goals.home ? ':trophy:' : ''} ${game.teams.away.name} at ${game.teams.home.name} ${game.goals.home > game.goals.away ? ':trophy:' : ''} on ${gameDate.toLocaleDateString()} ${game.goals.away} - ${game.goals.home}\n`;
    } else { // in progress
      // fields.push({ name: `test`, value: `test`, inline: true }, { name: `test`, value: `test`, inline: true }, { name: `test`, value: `test`, inline: true });
      description += `${game.teams.away.name} at ${game.teams.home.name} LIVE ${game.goals.away} - ${game.goals.home}\n`;
    }
    
    // Check if it's the last iteration
    if (i === games.length - 1) {
      const embed = new EmbedBuilder().setTitle(`${gameDate.toLocaleString('en-us', { month: 'long' } )}`);
      embed.setDescription(description);
      // embed.addFields(...fields);
      embeds.push(embed);
    }
  }
  return embeds;
}