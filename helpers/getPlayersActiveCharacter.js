module.exports = function getPlayersActiveCharacter(characters, player) {
  const character = characters.find(x => x.player.toString() == player.toString() && x.isAlive && !x.isRetired);
  return character;
}