module.exports = function capitalizeFirstLetter(str) {
  const firstLetter = str.charAt(0);
  const Cap = firstLetter.toUpperCase();
  const rest = str.slice(1);

  return (Cap + rest);
}