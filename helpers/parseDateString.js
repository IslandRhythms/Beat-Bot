
module.exports = function parseDateString(str) {
  const [month, day, year] = str.match(/(\d{2})(\d{2})(\d{4})/).slice(1, 4).map(v => +v);
  return new Date(year, month - 1, day);
}