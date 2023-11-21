const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('createnote')
  .setDescription('saves information you write to the db')
  .addStringOption(option => option.setName('title').setDescription('the title of the note').setRequired(true))
  .addStringOption(option => option.setName('text').setDescription('The information to be stored').setRequired(true))
  .addUserOption(option => option.setName('user').setDescription('Another user that can access this created note.'))
  .addRoleOption(option => option.setName('role').setDescription('Anyone with the selected role can access the created note.')),
  async execute(interaction, conn) {
    await interaction.deferReply();
    const { User, Note } = conn.models;
    const user = await User.findOne({ $or: [{ discordName: interaction.user.username }, { discordId: interaction.user.id }] });
    
    const title = interaction.options.getStringOption('title');
    const text = interaction.options.getStringOption('text');
    const discordUser = interaction.options.getUserOption('user');
    const role = interaction.options.getRoleOption('role');

    const dataObject = {
      noteCreator: {
        discordId: interaction.user.id,
        mongoId: user._id
      },
      text,
      title,
      guildId: interaction.guildId
    }

    if (discordUser) {
      dataObject.usersHaveAccess = [discordUser.id];
    }
    if (role) {
      dataObject.rolesHaveAccess = [role.id]
    }
    console.log('what is dataObject', dataObject);
    await interaction.followUp('Under Construction');
    return;
    await Note.create(dataObject);
  }
}