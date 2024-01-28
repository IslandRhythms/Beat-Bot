const axios = require('axios');


async function run() {
  const res = await axios.get(`https://food2fork.ca/api/recipe/search/?query=beef+carrot+potato+onion`).then(res => res.data);
  console.log('what is res', res);
}

run();