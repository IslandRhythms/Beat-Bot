const axios = require('axios');
require('../config');
const querystring = require('querystring');

module.exports = async function getSpotifyCredentials() {
  const headers = {
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
    },
    auth: {
      username: process.env.SPOTIFYCLIENTID,
      password: process.env.SPOTIFYCLIENTSECRET
    }
  };
  const data = {
    grant_type: 'client_credentials'
  };
  // this is beyond moronic
  const res = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify(data), headers).then(res => res.data);
  return res;
}