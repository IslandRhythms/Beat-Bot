const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');
const capitalizeFirstLetter = require('../../helpers/capitalizeFirstLetter');
const { Pagination } = require('pagination.djs');
const categorySummaries = require('../../categorySummaries.json'); // be sure to update the file if a new folder is added
module.exports = {
  data: new SlashCommandBuilder().setName('help').setDescription('Lists the commands of the bot'),
  async execute(interaction) {
    const pagination = new Pagination(interaction);
    await interaction.deferReply({ ephemeral: true }); // set options on pagination won't work unless you do this
    const commands = [];
    // Grab all the folders from the commands directory
    const commandDirectory = path.join(__dirname, '../');
    const commandFolders = fs.readdirSync(commandDirectory);
    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const folder of commandFolders) {
      const commandsPath = path.join(commandDirectory, folder);
      const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
          command.data.category = folder;
          command.data.summary = categorySummaries.find(x => x.name == folder).summary;
          commands.push(command.data.toJSON());
      }
    }
    const embeds = [];
    for (let i = 0; i < commandFolders.length; i++) {
      const embed = new EmbedBuilder();
      const category = commandFolders[i];
      embed.setTitle(capitalizeFirstLetter(category));
      for (let index = 0; index < commands.length; index++) {
        const command = commands[index];
        if (command.category == category) {
          embed.setDescription(command.summary);
          embed.addFields({ name: `/${command.name}`, value: command.description, inline: true })
        }
      }
      embeds.push(embed);
    }
    pagination.setEmbeds(embeds, (currentEmbed, index, array) => {
      currentEmbed.setFooter({ text: `Page ${index + 1} / ${array.length}`});
      return currentEmbed.setAuthor({ name: `Beat Bot Available Commands`});
    });
    pagination.setOptions({ ephemeral: true });
    pagination.render();
  }
}