const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('createnote')
  .setDescription('saves information you write to the db')
  .addStringOption(option => option.setName('title').setDescription('the title of the note').setRequired(true))
  .addStringOption(option => option.setName('text').setDescription('The information to be stored').setRequired(true))
  .addStringOption(option => option.setName('users').setDescription('A comma separated list of users that can access the note.'))
  .addStringOption(option => option.setName('roles').setDescription('A comma separated list of the roles that have access to the note. Omit the @')),
  async execute(interaction, conn) {
    await interaction.deferReply();
    const { User, Note } = conn.models;
    const user = await User.findOne({ discordName: interaction.user.username });
    const guildMembers = interaction.member.guild.members;
    const serverRoles = interaction.member.guild.roles;
    console.log(typeof guildMembers, typeof serverRoles); // not arrays
    await interaction.followUp('Under Construction');
    return;
    const title = interaction.options.getStringOption('title');
    const text = interaction.options.getStringOption('text');
    const users = interaction.options.getStringOption('users');
    const roles = interaction.options.getRoleOption('roles');
    let usersHaveAccess = [];
    let rolesHaveAccess = [];
    if (users) {
      const userArray = users.split(',');
      for (let i = 0; i < userArray.length; i++) {
        // const profile = guildMembers.find(x => x.user.username == userArray[i]);
      }
    }
    if (roles) {
      const roleArray = roles.split(',');
      for (let i = 0; i < roleArray.length; i++) {
        // const profile = serverRoles.find(x => x.name == roleArray[i]);
      }
    }
    await Note.create({
      noteCreator: user._id,
      text,
      title,
      guildId: interaction.guildId
    })
  }
}