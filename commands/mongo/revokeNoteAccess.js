const { SlashCommandBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder().setName('revokenoteaccess')
  .setDescription('removes a user from all notes you have given them access. Add options to filter the notes.')
  .addStringOption(option => option.setName('title').setDescription('The title of the note'))
  .addStringOption(option => option.setName('noteid').setDescription('the id of the note'))
  .addRoleOption(option => option.setName('role').setDescription('the role to allow access'))
  .addUserOption(option => option.setName('user').setDescription('the user to give access')),
  async execute(interaction, conn) {
    await interaction.deferReply();

    const { Note } = conn.models;

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
    const notes = await Note.find(queryObject);
    for (let i = 0; i < notes.length; i++) {
      if (role && notes[i].rolesHaveAccess.includes(role.id)) {
        const index = notes[i].rolesHaveAccess.indexOf(role.id);
        notes[i].rolesHaveAccess.splice(index, 1);
      }
      if (user && notes[i].usersHaveAccess.includes(user.id)) {
        const index = notes[i].usersHaveAccess.indexOf(user.id);
        notes[i].usersHaveAccess.splice(index, 1);
      }
      await notes[i].save();
    }
    const messageArray = [];
    if (role) messageArray.push(role.name);
    if (user) messageArray.push(user.username);
    const message = `Proper note access has been revoked from ${messageArray.join(', ')}`;
    await interaction.followUp({ content: message, ephemeral: true });
  }
}