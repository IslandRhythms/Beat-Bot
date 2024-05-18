'use strict';

const Basketball = require('../../../sportsData/Basketball.json');
const Football = require('../../../sportsData/Football.json');
const Baseball = require('../../../sportsData/Baseball.json');
const Hockey = require('../../../sportsData/Hockey.json');
const Soccer = require('../../../sportsData/Soccer.json')

module.exports = async function sportsAutocomplete(interaction) {
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
  }

  let filtered = teams.filter(choice => choice.name.toLowerCase().includes(focusedValue));
  if (filtered.length > 25) {
    filtered = filtered.slice(0, 25);
  }
  return await interaction.respond(
    filtered.map(choice => ({ name: choice.name, value: choice.name })),
  );
}