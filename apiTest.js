const axios = require('axios');


async function run() {
  const res = await axios.get(`https://site.web.api.espn.com/apis/site/v2/sports/basketball/nba/teams/14`).then(res => res.data);
  console.log('what is res', res, res.team.nextEvent);

  // doesn't work for whatever reason
  const test = await axios.get(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/14/schedule`).then(res => res.data).catch(e => console.log(e.code))
  
  const response = await axios.get(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard`).then(res => res.data)

  console.log('what is response', response)
  // const teams = await axios.get(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/miami-heat/roster`)

  const teams = await axios.get(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams`).then(res => res.data.sports[0]);
  console.log('========')
  console.log(teams);
  console.log(teams.leagues)
  console.log(teams.leagues[0].teams[0])
  console.log(teams.leagues[0].teams.length)
}

run();