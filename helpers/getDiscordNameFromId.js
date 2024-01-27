module.exports = function getDiscordNameFromId(interaction, id) {
  const members = interaction.member.guild.members;
  const user = members.find(x => x.id == id);
  return user.username;
}