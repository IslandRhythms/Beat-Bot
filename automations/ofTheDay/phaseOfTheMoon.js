'use strict';
const axios = require('axios');

module.exports = async function phaseOfTheMoon() {
  console.log('getting the phase of the moon ...');
  try {
    const res = await axios.get(`http://api.farmsense.net/v1/moonphases/?d=${Date.now()}`).then(res => res.data);
    // could use the discord emojis I think: Ex: Waxing Crescent => :waxing_cresent_moon:
  
    if (res[0].ErrorMsg != 'success') {
      return { phaseOfTheMoon: { phase: 'something went wrong' } };
    }
  
    // build the emoji
    const lunar = res[0].Phase.split(' ');
    const emoji = `:${lunar[0].toLowerCase()}_${lunar[1].toLowerCase()}_moon:`;
  
    return { phaseOfTheMoon: { phase: res[0].Phase, moon: res[0].Moon[0], icon: emoji } };
  } catch (error) {
    console.log('something went wrong with phase of the moon', error);
  }
};