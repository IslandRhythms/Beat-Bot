const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');
module.exports = {
  data: new SlashCommandBuilder().setName('help').setDescription('Lists the commands of the bot'),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
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
          commands.push(command.data.toJSON());
      }
    }
    const embeds = [];
    const helpEmbed = new EmbedBuilder().setTitle('Beat Bot Available Commands')
    .setDescription('The following are the commands that Beat Bot has to offer sorted by category');
    embeds.push(helpEmbed);
    for (let i = 0; i < commandFolders.length; i++) {
      const embed = new EmbedBuilder();
      const category = commandFolders[i];
      embed.setTitle(category);
      for (let index = 0; index < commands.length; index++) {
        const command = commands[index];
        if (command.category == category) {
          embed.addFields({ name: `/${command.name}`, value: command.description })
        }
      }
      embeds.push(embed);
    }
    /*
    let str = `\`\`\`**${commands[0].category}**\n\n`;
    let cat = commands[0].category;
    for (let i = 0; i < commands.length; i++) {
      if (commands[i].category != cat) {
        cat = commands[i].category;
        str += `\n\n**${commands[i].category}**\n\n`
      }
      str += `/${commands[i].name} = ${commands[i].description}\n`;
    }
    str+= '```'
    return interaction.followUp({ content: str });
    */
   return interaction.followUp({ embeds });
  }
}