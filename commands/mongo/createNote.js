const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('createnote')
  .setDescription('saves information you write to the db')
  .addStringOption(option => option.setName('title').setDescription('the title of the note').setRequired(true))
  .addStringOption(option => option.setName('text').setDescription('The information to be stored').setRequired(true))
  .addUserOption(option => option.setName('user').setDescription('Another user that can access this created note.'))
  .addRoleOption(option => option.setName('role').setDescription('Anyone with the selected role can access the created note.'))
  .addBooleanOption(option => option.setName('private').setDescription('Set to true so when the bot finishes only you see the result.'))
  .addAttachmentOption(option > option.setName('image').setDescription('an image to save on the note')),
  async execute(interaction, conn) {
    await interaction.deferReply();
    const { User, Note } = conn.models;
    const user = await User.findOne({ $or: [{ discordName: interaction.user.username }, { discordId: interaction.user.id }] });
    
    const title = interaction.options.getString('title');
    const text = interaction.options.getString('text');
    const discordUser = interaction.options.getUser('user');
    const role = interaction.options.getRole('role');
    const private = interaction.options.getBoolean('private');
    const image = interaction.options.getAttachment('image');

    const dataObject = {
      noteCreator: {
        discordId: interaction.user.id,
        mongoId: user._id
      },
      text,
      title,
      image,
      guildId: interaction.guildId
    }

    if (discordUser) {
      dataObject.usersHaveAccess = [discordUser.id];
    }
    if (role) {
      dataObject.rolesHaveAccess = [role.id]
    }
    const res = await Note.create(dataObject);
    await interaction.followUp({ content: `Document created: ${res}`, ephemeral: private });
  }
}