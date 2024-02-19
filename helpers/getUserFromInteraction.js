
module.exports = function getUserFromInteraction(interaction, userId) {
  const members = interaction.member.guild.members;
  const user = members.find(x => x.id == userId);
  return user;
}