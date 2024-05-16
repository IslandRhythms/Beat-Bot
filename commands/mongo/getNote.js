const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const parseDateString = require('../../helpers/parseDateString');
const { Pagination } = require('pagination.djs');


module.exports = {
  data: new SlashCommandBuilder().setName('getnote')
  .setDescription('gets all notes you have access to. Pass args to filter notes.')
  .addStringOption(option => option.setName('title').setDescription('the title of the note.'))
  .addStringOption(option => option.setName('tag').setDescription('a tag the note has.'))
  .addStringOption(option => option.setName('noteid').setDescription('the id of the note. A combo of your username plus entry.'))
  .addStringOption(option => option.setName('whenstart').setDescription('when the note was created in the form MMDDYYYY'))
  .addStringOption(option => option.setName('whenend').setDescription('another date in the form MMDDYYYY. Use to determine a range of dates.'))
  .addBooleanOption(option => option.setName('private').setDescription('set to true so only you can see the result')),
  async execute(interaction, conn) {
    const pagination = new Pagination(interaction);
    const private = interaction.options.getBoolean('private');
    await interaction.deferReply({ ephemeral: private });
    const title = interaction.options.getString('title');
    const start = interaction.options.getString('whenstart');
    const end = interaction.options.getString('whenend');
    const tag = interaction.options.getString('tag');
    const noteId = interaction.options.getString('noteid');
    const { User, Note } = conn.models;
    const user = await User.findOne({ $or: [{ discordName: interaction.user.username }, { discordId: interaction.user.id }] });
    const roles = [];
    interaction.member.roles.cache.forEach(role => roles.push(role.id))
    const queryObject = {
      guildId: interaction.guildId,
      $or: [{ 'noteCreator.discordId': user.discordId }, { usersHaveAccess: user.discordId }]
    }
    if (noteId) {
      queryObject.noteId = noteId;
    }
    if (roles.length) {
      queryObject.$or.push({ rolesHaveAccess: { $in: roles } });
      // not sure if this is needed
      // queryObject.$or.push({ rolesHaveAccess: { $nin: roles } });
    }
    if (title) {
      queryObject.title = { $regex: title, $options: 'i' };
    }
    if (start) {
      queryObject.createdAt.$gte = parseDateString(start);
    }
    if (end) {
      queryObject.createdAt.$lte = parseDateString(end);
    }
    if (tag) {
      queryObject.tags = tag;
    }
    console.log('what is queryObject', queryObject);
    const notes = await Note.find(queryObject)
    const embeds = [];
    console.log('what is notes', notes);
    for (let i = 0; i < notes.length; i++) {
      const embed = new EmbedBuilder();
      embed.setTitle(notes[i].title);
      if (notes[i].image) {
        embed.addFields({ name: 'Image', value: notes[i].image})
      }
      if (notes[i].file) {
        embed.addFields({ name: 'File', value: notes[i].file })
      }
      embed.setAuthor({ name: notes[i].noteCreator.discordName })
      embed.setDescription(notes[i].text);
      embed.addFields(
        { name: 'tags', value: notes[i].tags.length ? notes[i].tags.join(',') : 'no tags available' },
        { name: 'noteId', value: notes[i].noteId ?? 'no noteId detected' },
      );
      embeds.push(embed);
    }
    
    if (embeds.length) {
      pagination.setEmbeds(embeds, (embed, index, array) => {
        return embed.setFooter({ text: `Page: ${index + 1}/${array.length}` });
      });
      return pagination.render();
    } else {
      await interaction.followUp('No notes found :(');
    }
  }
}