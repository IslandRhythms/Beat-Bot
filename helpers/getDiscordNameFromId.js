module.exports = function getDiscordNameFromId(guild, id) {
  const members = guild.members.cache;
  const { user } = members.find(x => x.id == id);
  return user.username;
}