const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const parseDateString = require('../../parseDateString');
const chunkString = require('../../chunkString');

module.exports = {
  data: new SlashCommandBuilder().setName('getnote')
  .setDescription('gets all notes you have access to. Pass args to filter notes.')
  .addStringOption(option => option.setName('title').setDescription('the title of the note.'))
  .addStringOption(option => option.setName('whenstart').setDescription('when the note was created in the form MMDDYYYY'))
  .addStringOption(option => option.setName('whenend').setDescription('another date in teh form MMDDYYYY. Use to determine a range of dates.')),
  async execute(interaction, conn) {
    await interaction.deferReply();
    const title = interaction.options.getString('title');
    const start = interaction.options.getString('whenstart');
    const end = interaction.options.getString('whenend');
    const { User, Note } = conn.models;
    const user = await User.findOne({ $or: [{ discordName: interaction.user.username }, { discordId: interaction.user.id }] });
    const roles = [];
    console.log('what roles does user have', interaction.user.roles);
    interaction.user.roles.forEach(role => roles.push(role.id));
    const queryObject = {
      rolesHaveAccess: { $in: roles },
      guildId: interaction.guildId,
      $or: [{ noteCreator: { discordId: user.discordId } }, { usersHaveAccess: user.discordId }]
    }
    if (title) {
      // https://stackoverflow.com/a/26814550
      queryObject.title = title;
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
    await interaction.followUp({ embeds });
  }
}