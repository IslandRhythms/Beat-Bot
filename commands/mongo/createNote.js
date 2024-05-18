const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const downloadFile = require('../../helpers/downloadFile');
const uploadFileToGoogle = require('../../helpers/uploadFileToGoogle');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder().setName('createnote')
  .setDescription('saves information you write to the db. Accessible to all unless specified otherwise.')
  .addStringOption(option => option.setName('title').setDescription('the title of the note. Limit 256 characters. Make it memorable.').setRequired(true))
  .addStringOption(option => option.setName('text').setDescription('The information to be stored. Limit 4096 characters').setRequired(true))
  .addUserOption(option => option.setName('user').setDescription('Another user that can access this created note.'))
  .addRoleOption(option => option.setName('role').setDescription('Anyone with the selected role can access the created note.'))
  .addBooleanOption(option => option.setName('private').setDescription('Set to true so when the bot finishes only you see the result.'))
  .addAttachmentOption(option => option.setName('image').setDescription('an image to save on the note'))
  .addAttachmentOption(option => option.setName('file').setDescription('a text document or similar to save on the note.'))
  .addStringOption(option => option.setName('tags').setDescription('a comma separated list of tags to categorize the note')),
  async execute(interaction, conn) {
    const private = interaction.options.getBoolean('private');
    await interaction.deferReply({ ephemeral: private });
    const { User, Note } = conn.models;
    const user = await User.findOne({ $or: [{ discordName: interaction.user.username }, { discordId: interaction.user.id }] });
    
    const title = interaction.options.getString('title');
    const text = interaction.options.getString('text');
    const discordUser = interaction.options.getUser('user');
    const role = interaction.options.getRole('role');
    const checkImage = interaction.options.getAttachment('image') ? isImage(interaction.options.getAttachment('image').contentType) : false;
    const fileAttachment = interaction.options.getAttachment('file');
    console.log('what is fileAttachment', fileAttachment);
    const checkFile = fileAttachment ? isAcceptableFile(fileAttachment.contentType) : false;
    const tags = interaction.options.getString('tags') ?? '';
    const tagArray = tags.length ? tags.split(',') : [];
    const searchArray = [];
    for (let i = 0; i < tagArray.length; i++) {
      searchArray.push(tagArray[i].trim());
    }


    const existingNotes = await Note.find({ 'noteCreator.discordId' : interaction.user.id });
    const noteId = interaction.user.username + existingNotes.length;

    const dataObject = {
      noteCreator: {
        discordId: interaction.user.id,
        discordName: interaction.user.username,
        mongoId: user._id
      },
      text: text.length > 4096 ? text.slice(0, 4096) : text,
      title: title.length > 256 ? title.slice(0, 256) : title,
      guildId: interaction.guildId,
      tags: searchArray,
      noteId
    }
    const file = checkFile ? fileAttachment.url : '';
    const fileName = fileAttachment ? fileAttachment.name : '';
    // need to do the same for images
    if (file) {
      const outputPath = `./${fileName}`;
      await downloadFile(file, outputPath);
      const links = await uploadFileToGoogle(fileName, outputPath, fileAttachment.contentType);
      fs.unlinkSync(outputPath);
      dataObject.file = links.webViewLink;
    }

    const imageData = checkImage ? interaction.options.getAttachment('image') : '';
    const image = checkImage ? interaction.options.getAttachment('image').url : '';

    if (image) {
      const outputPath = `./${imageData.name}`
      await downloadFile(image, outputPath);
      const links = await uploadFileToGoogle(imageData.name, outputPath, imageData.contentType)
      fs.unlinkSync(outputPath);
      dataObject.image = links.webViewLink
    }
    console.log('what is image', image, 'what is file', file);

    const fieldArray = [{ name: 'noteId', value: dataObject.noteId }];
    
    if (discordUser) {
      dataObject.usersHaveAccess = [discordUser.id];
      fieldArray.push({ name: 'usersHaveAccess', value: discordUser.username });
    }
    if (role) {
      dataObject.rolesHaveAccess = [role.id];
      fieldArray.push({ name: 'rolesHaveAccess', value: role.name });
    }
    if (file) {
      fieldArray.push({ name: fileName, value: dataObject.file });
    }
    if (dataObject.tags && dataObject.tags.join(',').length) {
      fieldArray.push({ name: 'tags', value: dataObject.tags.join(',')});
    }

    const embed = new EmbedBuilder();
    embed.setTitle(dataObject.title);
    if (dataObject.image) {
      embed.setImage(image);
      embed.addFields({
        name: 'Image Link', value: dataObject.image
      });
    }
    embed.setAuthor({ name: dataObject.noteCreator.discordName })
    embed.setDescription(dataObject.text);
    for (let i = 0; i < fieldArray.length; i++) {
      embed.addFields(
        { name: fieldArray[i].name, value: fieldArray[i].value },
      );
    }
    await Note.create(dataObject);
    await interaction.followUp({ content: `Document created. Be sure to remember the title or noteId for easy lookup. `, embeds: [embed] });
  }
}

function isImage(type) {
  const allowed = ['image/jpeg', 'image/png', 'image/svg+xml']
  if (allowed.includes(type)) {
    return true;
  }
  return false;
}

function isAcceptableFile(type) {
  const allowed = ['application/pdf', 'text/html; charset=utf-8', 'text/plain; charset=utf-8', 'text/markdown'];
  if (allowed.includes(type)) {
    return true;
  }
  return false;
}