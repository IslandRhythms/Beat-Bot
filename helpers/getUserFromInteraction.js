
module.exports = async function getUserFromInteraction(interaction, userId) {
  const members = await interaction.member.guild.members.fetch();
  const user = members.find(x => x.id == userId);
  return user;
}