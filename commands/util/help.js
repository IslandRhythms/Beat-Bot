const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ComponentType, ButtonBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');
const capitalizeFirstLetter = require('../../helpers/capitalizeFirstLetter');
const { Pagination, ExtraRowPosition } = require('pagination.djs');
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
        // search command.data.options for subcommand information
        command.data.category = folder;
        command.data.summary = categorySummaries.find(x => x.name == folder).summary;
        commands.push(command.data.toJSON());
      }
    }
    const embeds = [];
    let totalCommands = 0;
    const row = new ActionRowBuilder();
    const selectMenu = new StringSelectMenuBuilder().setCustomId('categorySelect').setPlaceholder('Jump to ...')
    for (let i = 0; i < commandFolders.length; i++) {
      const embed = new EmbedBuilder();
      const category = commandFolders[i];
      embed.setTitle(capitalizeFirstLetter(category));
      selectMenu.addOptions(new StringSelectMenuOptionBuilder().setLabel(capitalizeFirstLetter(category)).setValue(capitalizeFirstLetter(category)));
      for (let index = 0; index < commands.length; index++) {
        const command = commands[index];
        if (command.category == category) {
          totalCommands++;
          embed.setDescription(command.summary);
          embed.addFields({ name: `/${command.name}`, value: command.description, inline: true })
        }
      }
      embeds.push(embed);
    }

    pagination.setEmbeds(embeds, (currentEmbed, index, array) => {
      currentEmbed.setFooter({ text: `Page ${index + 1} / ${array.length} Total available commands ${totalCommands}`});
      return currentEmbed.setAuthor({ name: `Beat Bot Available Commands`});
    });
    pagination.setOptions({ ephemeral: true });
    row.addComponents(selectMenu);
    // for some reason, it can't render the letter symbols
    pagination.buttons = {
      // first: new ButtonBuilder().setCustomId('first').setLabel('/U0001F1ED').setEmoji(':regional_indicator_h:').setDisabled(true).setStyle('Success'),
      // last: new ButtonBuilder().setCustomId('last').setLabel('🇪').setDisabled(true).setStyle('Success'),
      // next: new ButtonBuilder().setCustomId('next').setLabel('🇱').setDisabled(true).setStyle('Success'),
      // prev: new ButtonBuilder().setCustomId('prev').setEmoji(':parking:').setDisabled(true).setStyle('Success'),
      extra: new ButtonBuilder().setCustomId('exclaim').setEmoji('❕').setDisabled(true).setStyle('Success'),
    }
    pagination.addActionRows([row], ExtraRowPosition.Above)
    const msg = await pagination.render();
    // bot cannot react to ephemeral messages
    // doing this breaks the default buttons
    const collector = await msg.createMessageComponentCollector({ componentType: ComponentType.StringSelect, filter: (i) => i.user.id === interaction.user.id, time: 360_000 });

    collector.on('collect', async i => {
      const index = embeds.findIndex(x => x.data.title == i.values[0]);
      if (index != -1) {
        pagination.goToPage(index + 1);
        pagination.ready();
        await pagination.editReply(pagination);
        await i.reply({ content: `Jumped to ${i.values}`, ephemeral: true });
        setTimeout(async () => {
          await i.deleteReply();
        }, 3000)
      } else {
        await i.reply({ content: `Category ${i.values} could not be found`, ephemeral: true });
        setTimeout(async () => {
          await i.deleteReply();
        }, 500)
      }
    });
  }
}