const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

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
    await interaction.deferReply();
    const { User, Note } = conn.models;
    const user = await User.findOne({ $or: [{ discordName: interaction.user.username }, { discordId: interaction.user.id }] });
    
    const title = interaction.options.getString('title');
    const text = interaction.options.getString('text');
    const discordUser = interaction.options.getUser('user');
    const role = interaction.options.getRole('role');
    const private = interaction.options.getBoolean('private');
    const checkImage = interaction.options.getAttachment('image') ? isImage(interaction.options.getAttachment('image').contentType) : false;
    const image = checkImage ? interaction.options.getAttachment('image').url : '';
    const fileAttachment = interaction.options.getAttachment('file');
    const checkFile = fileAttachment ? isAcceptableFile(fileAttachment.contentType) : false;
    const file = checkFile ? fileAttachment.url : '';
    const fileName = fileAttachment ? fileAttachment.name : '';
    const tags = interaction.options.getString('tags');
    const tagArray = tags.split(',');
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
      image,
      file,
      guildId: interaction.guildId,
      tags: searchArray,
      noteId
    }

    if (discordUser) {
      dataObject.usersHaveAccess = [discordUser.id];
    }
    if (role) {
      dataObject.rolesHaveAccess = [role.id]
    }

    const embed = new EmbedBuilder();
    embed.setTitle(dataObject.title);
    embed.setImage(dataObject.image);
    embed.setAuthor({ name: dataObject.noteCreator.discordName })
    embed.setDescription(dataObject.text);
    embed.addFields(
      { name: 'tags', value: dataObject.tags.join(',') },
      { name: 'noteId', value: dataObject.noteId },
      { name: 'usersHaveAccess', value: discordUser.username },
      { name: 'rolesHaveAccess', value: role.name },
      { name: fileName, value: file }
    );
    const res = await Note.create(dataObject);
    await interaction.followUp({ content: `Document created. Be sure to remember the title or noteId for easy lookup. `, embeds: [embed], ephemeral: private });
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
  const allowed = ['application/pdf', 'text/html', 'text/plain', 'text/markdown'];
  if (allowed.includes(type)) {
    return true;
  }
  return false;
}