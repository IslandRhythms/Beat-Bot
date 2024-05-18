'use strict';

const getSpotifyCredentials = require('../../helpers/getSpotifyCredentials');
const axios = require('axios');
const querystring = require('querystring');

module.exports = async function songOfTheDay() {
  console.log('getting song of the day ...')
  try {
    const { access_token } = await getSpotifyCredentials();

    const headers = {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    };
    const { genres } = await axios.get(`https://api.spotify.com/v1/recommendations/available-genre-seeds`, headers).then(res => res.data);
  
    const selectedGenreIndex = Math.floor(Math.random() * genres.length);
    const selectedGenre = genres[selectedGenreIndex];
  
    const data = {
      q: `genre:${selectedGenre}`,
      type: 'track',
      limit: 1
    }
  
    const { tracks } = await axios.get(`https://api.spotify.com/v1/search?`+querystring.stringify(data), headers).then(res => res.data);
  
    const track = tracks.items[0].id;
  
    const trackData = await axios.get(`https://api.spotify.com/v1/tracks/${track}`, headers).then(res => res.data);
  
    const songOfTheDay = {
      name: trackData.name,
      url: trackData.external_urls.spotify,
      artist: trackData.artists[0].name,
      genre: selectedGenre,
      image: trackData.album.images[0].url
    }
    return songOfTheDay;
  } catch (error) {
    console.log('something went wrong with song of the day', error);
    return { name: null }
  }
}