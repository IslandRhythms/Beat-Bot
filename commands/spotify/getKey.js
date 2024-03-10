const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const getSpotifyCredentials = require('../../helpers/getSpotifyCredentials');
const { musicKeys, musicModes } = require('../../constants');

// https://developer.spotify.com/documentation/web-api

module.exports = {
  cooldown: 60,
  data: new SlashCommandBuilder().setName('getkey').setDescription('gets the key of the given track, or recurring key of the album or playlist.')
  .addSubcommand(subcommand => subcommand.setName('track').setDescription('the key of the track')
    .addStringOption(option => option.setName('trackid')
    .setDescription('the id of the track from spotify that can be retrieved from the url.')
    .setRequired(true)))
  .addSubcommand(subcommand => subcommand.setName('album').setDescription('the most recurring key of the album. Will only analyze first 50 tracks of the album.')
    .addStringOption(option => option.setName('albumid')
    .setDescription('the id of the album from spotify that can be retrieved from the url.')
    .setRequired(true)))
  .addSubcommand(subcommand => subcommand.setName('playlist').setDescription('the the most recurring key of the playlist')
    .addStringOption(option => option.setName('playlistid')
    .setDescription('the id of the playlist from spotify that can be retrieved from the url.')
    .setRequired(true))),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const { access_token } = await getSpotifyCredentials();
    const property = interaction.options._subcommand;
    const id = interaction.options.getString(`${property}id`);
    const headers = {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    };
    // https://github.com/IslandRhythms/MyKeySig/tree/master/public
    if (property == 'track') {
      const spotify = await axios.get(`https://api.spotify.com/v1/audio-features/${id}`, headers).then(res => res.data);
      return interaction.followUp(`The key of the track is ${musicKeys[spotify.key]} ${musicModes[spotify.mode]}`);
    } else if (property == 'album') {
      const { items } = await axios.get(`https://api.spotify.com/v1/albums/${id}/tracks?limit=50`, headers).then(res => res.data);
      if (!items) {
        return interaction.followUp('Could not find album. Please ensure that the id is correct.')
      }
      const songKeys = [];
      for (let i = 0; i < items.length; i++) {
        const data = await axios.get(`https://api.spotify.com/v1/audio-features/${items[i].id}`, headers).then(res => res.data);
        songKeys.push({ key: data.key, mode: data.mode });
      }
      const spotify = getRecurringKey(songKeys);
      return interaction.followUp(`The most recurring key of the album is ${musicKeys[spotify.key]} ${musicModes[spotify.mode]}`)
    } else {
      const { items } = await axios.get(`https://api.spotify.com/v1/playlists/${id}/tracks?fields=items(track.id)`, headers).then(res => res.data);
      if (!items) {
        return interaction.followUp(`Count not find the playlist. Please ensure that the id is correct.`);
      }
      const songKeys = [];
      for (let i = 0; i < items.length; i++) {
        const data = await axios.get(`https://api.spotify.com/v1/audio-features/${items[i].track.id}`, headers).then(res => res.data);
        songKeys.push({ key: data.key, mode: data.mode });
      }
      const spotify = getRecurringKey(songKeys);
      return interaction.followUp(`The most recurring key of the playlist is ${musicKeys[spotify.key]} ${musicModes[spotify.mode]}`)
    }
  }
}

function getRecurringKey(songs) {
  songs.sort(function (a,b) {
    (a.key > b.key) ? 1 : -1;
  });

  const king = {
    key: songs[0].key,
    mode: songs[0].mode
  };
  let count = 0;
  let compare = 0;
  for (let i = 0; i < songs.length; i++) {
    if (JSON.stringify(songs[i]) !== JSON.stringify(songs[i+1]) && count > compare) {
      king.key = songs[i+1].key;
      king.mode = songs[i+1].mode;
      compare = count;
      count = 0;
    } else if (JSON.stringify(songs[i]) === JSON.stringify(songs[i+1])) {
      count++;
    }
  }
  return king;
}