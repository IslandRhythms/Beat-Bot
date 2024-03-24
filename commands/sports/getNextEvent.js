const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const Basketball = require('../../Basketball.json');
const Football = require('../../Football.json');
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
      option.setName('league').setDescription('the league (mlb, ncaa)').setRequired(true).addChoices(
        { name: 'MLB', value: 'MLB' },
        { name: 'NCAA', value: 'NCAA' }
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
        option.setName('team').setDescription('the name of the team').setRequired(true).setAutocomplete(true))),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const league = interaction.options.getString('league');
    const team = interaction.options.getString('team');
    let sport = interaction.options._subcommand;
    let leagueId = '';
    let teamId = '';
    let season = '';
    if (sport == 'football') {
      sport = 'american-football';
    } else if (sport == 'basketball') {
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
      console.log('what is season', season);
    }
    const config = {
      method: 'GET',
      url: `https://v1.${sport}.api-sports.io/games?league=${leagueId}&team=${teamId}&season=${season}`,
      headers: {
        'x-rapidapi-key': process.env.SPORTSAPIKEY,
        'x-rapidapi-host': `v1.${sport}.api-sports.io`
      }
    };
  
    const  { response } = await axios(config).then(res => res.data);
    const ignoreStatus = ['FT', 'AOT', 'POST', 'CANC', 'SUSP', 'AWD', 'ABD', 'Q1', 'Q2', 'Q3', 'Q4', 'OT', 'BT', 'HT'];
    const futureGames = response.filter(x => !ignoreStatus.includes(x.status.short));
    const nextGame = futureGames.sort( function(a,b) {
      if(a.timestamp < b.timestamp) {
        return -1;
      } else {
        return 1;
      }
    })[0];
    console.log('what is nextGame', nextGame, new Date(nextGame.timestamp * 1000));
    const homeImage = await downloadImage(nextGame.teams.home.logo)
    const awayImage = await downloadImage(nextGame.teams.away.logo);

    const width = Math.max(homeImage.getWidth(), awayImage.getWidth())
    const height = Math.max(homeImage.getWidth(), awayImage.getWidth());


    const canvas = new Jimp(width * 2, height);

    const xPos1 = Math.floor((width - awayImage.getWidth()) / 2);
    const xPos2 = Math.floor((width - homeImage.getWidth()) / 2) + width;

    canvas.composite(awayImage, xPos1, Math.floor((height - awayImage.getHeight()) / 2));
    canvas.composite(homeImage, xPos2, Math.floor((height - homeImage.getHeight()) / 2));
    const outputPath = `../../next${sport}event.png`;
    await canvas.writeAsync(outputPath);
    const embed = new EmbedBuilder()
      .setTitle(`${team}'s Next Game: ${nextGame.teams.away.name} at ${nextGame.teams.home.name} on ${new Date(nextGame.timestamp * 1000).toLocaleString()}`)
      .setAuthor({ name: `${league}`, iconURL: `${nextGame.league.logo}`})
      .setImage(`attachment://next${sport}event.png`)
      .setFooter({ text: `Possible thanks to api-${sport}.com`})
    await interaction.followUp({ embeds: [embed], files: [{ attachment: outputPath, name: `next${sport}event.png`}]});
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
