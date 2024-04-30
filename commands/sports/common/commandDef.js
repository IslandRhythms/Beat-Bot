'use strict';

const { SlashCommandBuilder } = require('discord.js');

// idea: check command name. depending on the name maybe we can append an argument to the return result of this after everything is said and done i.e. addStringOption('status') for getnextevent

module.exports = function commandDef(commandName, commandDescription) {
  return new SlashCommandBuilder().setName(commandName)
  .setDescription(commandDescription)
  .addSubcommand(subcommand =>
    subcommand.setName('basketball').setDescription('basketball')
      .addStringOption(option =>
        option.setName('league').setDescription('the league (nba, ncaa)').setRequired(true).addChoices(
          { name: 'NBA', value: 'NBA' },
          { name: 'NCAA', value: 'NCAA' }
        )
      )
    .addStringOption(option =>
      option.setName('team').setDescription('the name of the team').setRequired(true).setAutocomplete(true)
    )
  )
  .addSubcommand(subcommand => 
    subcommand.setName('football').setDescription('american football')
    .addStringOption(option =>
      option.setName('league').setDescription('the league (nfl, ncaa)').setRequired(true).addChoices(
        { name: 'NFL', value: 'NFL' },
        { name: 'NCAA', value: 'NFL' }
      )
    )
    .addStringOption(option =>
      option.setName('team').setDescription('the name of the team').setRequired(true).setAutocomplete(true)
    )
  )
  .addSubcommand(subcommand => 
    subcommand.setName('baseball').setDescription('baseball')
    .addStringOption(option =>
      option.setName('league').setDescription('the league (mlb)').setRequired(true).addChoices(
        { name: 'MLB', value: 'MLB' },
        // { name: 'NCAA', value: 'NCAA' }
      )
    )
    .addStringOption(option =>
      option.setName('team').setDescription('the name of the team').setRequired(true).setAutocomplete(true)
    )
  )
  .addSubcommand(subcommand => 
    subcommand.setName('hockey').setDescription('hockey')
    .addStringOption(option =>
      option.setName('league').setDescription('the league (nhl, ncaa)').setRequired(true).addChoices(
        { name: 'NHL', value: 'NHL' },
        { name: 'NCAA', value: 'NCAA' }
      )
    )
    .addStringOption(option =>
      option.setName('team').setDescription('the name of the team').setRequired(true).setAutocomplete(true)
    )
  )
  .addSubcommand(subcommand => 
    subcommand.setName('soccer').setDescription('internationally known as football')
    .addStringOption(option =>
      option.setName('league').setDescription('the league').setRequired(true).addChoices(
        { name: 'Bundesliga', value: 'Bundesliga' },
        { name: 'La Liga', value: 'La Liga' },
        { name: 'Serie A', value: 'Serie A' },
        { name: 'Premiere League (UK)', value: 'Premiere League' }
      )
    )
    .addStringOption(option =>
      option.setName('team').setDescription('the name of the team').setRequired(true).setAutocomplete(true)
    )
  )
}