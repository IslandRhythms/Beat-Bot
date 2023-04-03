const { SlashCommandBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');
const VDF = require('vdf-parser');

const collectionFile = fs.readFileSync('C:\\Program Files (x86)\\Steam\\userdata\\256486405\\7\\remote\\sharedconfig.vdf').toString();
const res = VDF.parse(collectionFile);

module.exports = {
  data: new SlashCommandBuilder().setName('recgames').setDescription('lists the games that I currently find fun to play'),
  async execute(interaction) {
    console.log('what is res', res);
    const apps = res.UserRoamingConfigStore.Software.Valve.Steam.apps;
    console.log('what is the obj we want', apps)
    for (const key in apps) {
      if (Object.keys(apps[key]).length > 0) {
        if (apps[key].tags) {
          console.log('the key is', key, 'the value is', apps[key], 'what is in tags', Object.values(apps[key]?.tags));
        }
      }
    }
    await interaction.reply('I do not do anything right now')
  }
}