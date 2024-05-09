'use strict';
const axios = require('axios');

module.exports = async function valorantMatchesOfTheDay() {
  const res = await axios.get(`https://vlrggapi.vercel.app/match?q=upcoming`).then(res => res.data);
}