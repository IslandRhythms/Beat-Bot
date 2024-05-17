const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const getDiscordAvatar = require('../../helpers/getDiscordAvatar');
const uploadFileToGoogle = require('../../helpers/uploadFileToGoogle');
const downloadFile = require('../../helpers/downloadFile');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder().setName('createadventure')
  .setDescription('log an adventure you\'ve created to share with the server')
  .addStringOption(option => option.setName('title').setDescription('The title of the adventure').setRequired(true))
  .addStringOption(option => option.setName('description').setDescription('a short summary of the adventure').setRequired(true))
  .addStringOption(option => option.setName('url').setDescription('a link to the document. can be from homebrewery, gmbinder, etc'))
  .addAttachmentOption(option => option.setName('document').setDescription('a file of the adventure if you do not have a link'))
  .addAttachmentOption(option => option.setName('picture').setDescription('A cover photo for the adventure')),
  async execute(interaction, conn) {
    await interaction.deferReply({ ephemeral: true });
    const { Adventure, User } = conn.models;
    const url = interaction.options.getString('url');
    const document = interaction.options.getAttachment('document');
    if (!url && !document) {
      return interaction.followUp('Please provide either a link to or a document of the adventure')
    }
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');
    const picture = interaction.options.getAttachment('picture');
    const user = await User.findOne({ discordId: interaction.user.id });
    const obj = { designer: user._id, title, description };
    if (url && document) {
      obj.url = url;
      await downloadFile(document.url, `./${document.name}`)
      const links = await uploadFileToGoogle(document.name, `./${document.name}`, document.contentType);
      obj.document = links.webViewLink;
      fs.unlinkSync(`./${document.name}`)
    } else if (url) {
      obj.url = url;
    } else {
      obj.document = document.url;
      await downloadFile(document.url, `./${document.name}`)
      const links = await uploadFileToGoogle(document.name, `./${document.name}`, document.contentType);
      obj.document = links.webViewLink;
      fs.unlinkSync(`./${document.name}`)
    }

    if (picture) {
      const outputPath = `./${picture.name}`
      await downloadFile(picture.url, outputPath);
      const links = await uploadFileToGoogle(picture.name, outputPath, picture.contentType)
      fs.unlinkSync(outputPath);
      obj.picture = links.webViewLink;
    }

    const adventure = await Adventure.create(obj);
    const avatar = getDiscordAvatar(interaction.user);

    const embed = new EmbedBuilder()
    .setAuthor({ name: interaction.user.username, iconURL: avatar })
    .setTitle(`${adventure.title}`)
    .setDescription(`${adventure.description}`)
    if (picture) {
      embed.setImage(`${picture.url}`);
      embed.addFields({ name: 'Image', value: adventure.picture })
    }
    if (adventure.url) {
      embed.setURL(adventure.url)
    } else {
      embed.setURL(adventure.document)
    }
    await interaction.followUp({ embeds: [embed] });
  }
}