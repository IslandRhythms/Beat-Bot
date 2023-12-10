const { SlashCommandBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder().setName('givenoteaccess')
  .setDescription('gives a user or role access to all of your notes. Add options to filter the notes.')
  .addStringOption(option => option.setName('title').setDescription('The title of the note'))
  .addStringOption(option => option.setName('noteid').setDescription('the id of the note'))
  .addRoleOption(option => option.setName('role').setDescription('the role to allow access'))
  .addUserOption(option => option.setName('user').setDescription('the user to give access')),
  async execute(interaction, conn) {
    await interaction.deferReply();
    const role = interaction.options.getRole('role');
    const user = interaction.options.getUser('user');
    const noteId = interaction.options.getString('noteId');
    const title = interaction.options.getString('title');
    const queryObject = {
      'noteCreator.discordId': interaction.user.id,
    };
    if (noteId) {
      queryObject.$or.push({ noteId: noteId })
    }
    if (title) {
      queryObject.$or.push({ title: title });
    }
    const { Note } = conn.models;
    const notes = await Note.find(queryObject);
    for (let i = 0; i < notes.length; i++) {
      if (role && !notes[i].rolesHaveAccess.includes(role.id)) {
        notes[i].rolesHaveAccess.push(role.id);
      }
      if (user && !notes[i].usersHaveAccess.includes(user.id)) {
        notes[i].usersHaveAccess.push(user.id);
      }
      await notes[i].save();
    }
    await interaction.followUp({ content: `Proper note access has been given to ${user.username}`, ephemeral: true });
  }
}