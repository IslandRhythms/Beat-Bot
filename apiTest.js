const axios = require('axios');


async function run() {
  const res = await axios.get(`https://date.nager.at/api/v3/PublicHolidays/2024/US`).then(res => res.data);
  console.log('what is res', res);
}

run();