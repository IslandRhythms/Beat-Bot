const axios = require('axios');

module.exports = async function phaseOfTheMoon(db) {
  const res = await axios.get(`http://api.farmsense.net/v1/moonphases/?d=${Date.now()}`).then(res => res.data);
  // could use the discord emojis I think: Ex: Waxing Crescent => :waxing_cresent_moon:
  const { Daily } = db.models;
  const doc = await Daily.findOne();
  await doc.save();
};