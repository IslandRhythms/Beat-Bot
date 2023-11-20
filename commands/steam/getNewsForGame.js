require('../../config');

const { SlashCommandBuilder } = require("discord.js");
const fetch = require('node-fetch');


module.exports = {
  data: new SlashCommandBuilder().setName('gamenews').setDescription('gets the latest news for a given game. Provide only one input.')
  .addStringOption(option => option.setName('game').setDescription('the name of the game'))
  .addStringOption(option => option.setName('id').setDescription('the app id of the game')),
  async execute(interaction) {
    await interaction.deferReply();
    const game = interaction.options.getString('game');
    const id = interaction.options.getString('id');
    if (!game && !id) {
      return interaction.followUp('You must give either the id or the name of the game for this command to execute')
    }
    let appid = id ? id : '';
    // This is really dumb but its the only way to do it rn.
    if (game) {
      const res = await fetch(`https://api.steampowered.com/ISteamApps/GetAppList/v2/?key=${process.env.STEAMAPIKEY}`).then(res => res.json());
      for (let i = 0; i < res.applist.apps.length; i++) {
        const item = res.applist.apps[i];
        if (item.name.toLowerCase() == game.toLowerCase()) {
          appid = item.appid
          break;
        }
      }
    }
    if (appid) {
      const data = await fetch(`https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?key=${process.env.STEAMAPIKEY}&appid=${appid}`).then(res => res.json());
      const newsitems = data.appnews.newsitems;
      console.log(newsitems[0], newsitems[1], newsitems[2]);
      return interaction.followUp(`${newsitems[0].title}\n ${newsitems[0].url.replace(/\s+/g, '')}`);
    } else {
      return interaction.followUp(`Could not find anything for ${game}`)
    }
  }
}