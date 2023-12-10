const { SlashCommandBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder().setName('revokenoteaccess')
  .setDescription('removes a user from all notes you have given them access. Add options to filter the notes.')
  .addStringOption(option => option.setName('title').setDescription('The title of the note'))
  .addStringOption(option => option.setName('noteid').setDescription('the id of the note'))
  .addStringOption(option => option.setName('when').setDescription('when the note was created in the form MMDDYYYY')),
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

    await interaction.followUp({ content: `Revoked note access from ${user.username}`, ephemeral: true });
  }
}