const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const sportsOrgs = require('../../sportsOrgs.json');

module.exports = {
  cooldown: 30,
  data: new SlashCommandBuilder().setName('getnextevent')
  .setDescription('get the next event for the indicated team')
  .addSubcommand(subcommand =>
    subcommand.setName('basketball').setDescription('basketball')
      .addStringOption(option =>
        option.setName('league').setDescription('the league (nba, ncaa)').setRequired(true))
        .addStringOption(option =>
          option.setName('team').setDescription('the name of the team').setRequired(true).setAutocomplete(true)))
  .addSubcommand(subcommand => 
    subcommand.setName('football').setDescription('american football')
    .addStringOption(option =>
      option.setName('league').setDescription('the league (nfl, ncaa)').setRequired(true))
      .addStringOption(option =>
        option.setName('team').setDescription('the name of the team').setRequired(true).setAutocomplete(true)))
  .addSubcommand(subcommand => 
    subcommand.setName('baseball').setDescription('baseball')
    .addStringOption(option =>
      option.setName('league').setDescription('the league (mlb, ncaa)').setRequired(true))
      .addStringOption(option =>
        option.setName('team').setDescription('the name of the team').setRequired(true).setAutocomplete(true)))
  .addSubcommand(subcommand => 
    subcommand.setName('hockey').setDescription('hockey')
    .addStringOption(option =>
      option.setName('league').setDescription('the league (nhl, ncaa)').setRequired(true))
      .addStringOption(option =>
        option.setName('team').setDescription('the name of the team').setRequired(true).setAutocomplete(true)))
  .addSubcommand(subcommand => 
    subcommand.setName('soccer').setDescription('soccer (futbol)')
    .addStringOption(option =>
      option.setName('league').setDescription('the league (nhl, ncaa)').setRequired(true))
      .addStringOption(option =>
        option.setName('team').setDescription('the name of the team').setRequired(true).setAutocomplete(true)))
  .addSubcommand(subcommand => 
    subcommand.setName('tennis').setDescription('tennis')),
  async execute(interaction) {
    await interaction.deferReply();
    console.log('what is team', interaction.options.getString('team'));
    await interaction.followUp(`Under Construction`);
  },
  async autocomplete(interaction) {
    let focusedValue = interaction.options.getFocused(true);
    // initial whitespace is causing it to send all results which results in a crash since limit is 25
    if (focusedValue.value == '') {
      focusedValue = null;
    } else {
      focusedValue = focusedValue.value.toLowerCase();
    }
    const org = interaction.options._subcommand;
    const sport = sportsOrgs.find(x => x.org == org);
    // this is spamming their api. Set a top level array so we only have to do this once.
    // long term solution is to keep locally in the repository so no one is getting spammed.
    const teams = await axios.get(`https://site.api.espn.com/apis/site/v2/sports/${sport.name}/${sport.org}/teams`).then(res => res.data.sports[0]);
    const choices = teams.leagues[0].teams;
		const filtered = choices.filter(choice => choice.team.location.toLowerCase().includes(focusedValue) || choice.team.name.toLowerCase().includes(focusedValue));
		await interaction.respond(
			filtered.map(choice => ({ name: choice.team.displayName, value: choice.team.displayName })),
		);
  }
}