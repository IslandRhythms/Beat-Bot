const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const VDF = require('vdf-parser');
const fetch = require('node-fetch');

const collectionFile = fs.readFileSync('C:\\Program Files (x86)\\Steam\\userdata\\256486405\\7\\remote\\sharedconfig.vdf').toString();
const res = VDF.parse(collectionFile);

module.exports = {
  data: new SlashCommandBuilder().setName('recgames').setDescription('lists the games that I currently find fun to play'),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const apps = res.UserRoamingConfigStore.Software.Valve.Steam.apps;
    const games = [];
    let str = "Here are some games that I've found to be super fun.\n";
    for (const key in apps) {
      if (Object.keys(apps[key]).length > 0) {
        if (apps[key].tags) {
          // https://stackoverflow.com/questions/57031685/how-can-i-get-details-about-an-steam-appid-from-steam-web-api
          // This isn't even official like god damn
          const test = await fetch(`https://store.steampowered.com/api/appdetails?appids=${key}`).then(res => res.json());
          const obj = {};
          obj.name = test[key].data.name; // cannot use dot notation for string numbers I guess
          obj.appId = key;
          obj.shortDescription = test[key].data.short_description;
          console.log('what is genres', test[key].data.genres)
          obj.genres = test[key].data.genres.map(({id, ...item}) => item);
          obj.link = `store.steampowered.com/app/${key}`;
          games.push(obj);

        }
      }
    }
    // now to format the string;
    await interaction.followUp(str)
    // There's a length requirement. So have to do it like this.
    for (let i = 0; i < games.length; i++) {
      const genres = [];
      games[i].genres.forEach(item => genres.push(item.description));
      await interaction.channel.send(`${games[i].name}\n${games[i].shortDescription}\n${genres.join(', ')}\n${games[i].link}\n===============================\n`);
      genres.length = 0;
    }
  }
}