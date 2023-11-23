const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const parseDateString = require('../../parseDateString');
const chunkString = require('../../chunkString');

module.exports = {
  data: new SlashCommandBuilder().setName('getnote')
  .setDescription('gets all notes you have access to. Pass args to filter notes.')
  .addStringOption(option => option.setName('title').setDescription('the title of the note.'))
  .addStringOption(option => option.setName('whenstart').setDescription('when the note was created in the form MMDDYYYY'))
  .addStringOption(option => option.setName('whenend').setDescription('another date in the form MMDDYYYY. Use to determine a range of dates.'))
  .addBooleanOption(option => option.setName('private').setDescription('set to true so only you can see the result')),
  async execute(interaction, conn) {
    await interaction.deferReply();
    const title = interaction.options.getString('title');
    const start = interaction.options.getString('whenstart');
    const end = interaction.options.getString('whenend');
    const private = interaction.options.getBoolean('private');
    const { User, Note } = conn.models;
    const user = await User.findOne({ $or: [{ discordName: interaction.user.username }, { discordId: interaction.user.id }] });
    const roles = [];
    interaction.member.roles.cache.forEach(role => roles.push(role.id))
    const queryObject = {
      guildId: interaction.guildId,
      $or: [{ 'noteCreator.discordId': user.discordId }, { usersHaveAccess: user.discordId }]
    }
    if (roles.length) {
      queryObject.rolesHaveAccess = { $in: roles };
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
    const notes = await Note.find(queryObject)
    const embeds = [];
    for (let i = 0; i < notes.length; i++) {
      const embed = new EmbedBuilder();
      embed.setTitle(notes[i].title);
      embed.setImage(notes[i].image);
      embed.setAuthor({ name: notes[i].noteCreator.discordName })
      embed.setDescription(notes[i].text);
      embeds.push(embed);
    }
    if (embeds.length) {
      await interaction.followUp({ embeds, ephemeral: private });
    } else {
      await interaction.followUp('No notes found :(')
    }
  }
}