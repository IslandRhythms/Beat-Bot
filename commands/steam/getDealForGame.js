const { SlashCommandBuilder } = require("discord.js");
const config = require('../../config.json');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder().setName('checkdeals').setDescription('given a game name, checks if there are any deals available')
  .addStringOption(option => option.setName('game').setDescription('the game to check').setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply();
    const game = interaction.options.getString('game');
    // This is really dumb but its the only way to do it rn.
    const res = await fetch(`https://api.steampowered.com/ISteamApps/GetAppList/v2/?key=${config.steamAPIKEY}`).then(res => res.json());
    let appid = '';
    for (let i = 0; i < res.applist.apps.length; i++) {
      const item = res.applist.apps[i];
      if (item.name.toLowerCase() == game.toLowerCase()) {
        appid = item.appid
        break;
      }
    }
    if (appid) {
      const data = await fetch(`http://store.steampowered.com/api/appdetails/?appids=${appid}&cc=us&l=en`).then(res => res.json());
      const key = Object.keys(data)[0];
      const details = data[key].data.price_overview;
      if(details.discount_percent == 0) {
        return interaction.followUp(`No deals for ${game} today, sorry :()`)
      } else {
        return interaction.followUp(`**${game}**\n$${details.initial / 100} => $${details.final / 100} (${details.discount_percent}% off)\nhttps://store.steampowered.com/app/${appid}`)
      }
    } else {
      return interaction.followUp(`${game} does not appear to be listed on steam. Please check that you spelled it correctly and that the game is in fact on steam.`);
    }
  }
}