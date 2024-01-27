const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const getSpotifyCredentials = require('../../helpers/getSpotifyCredentials');
const { musicKeys, musicModes } = require('../../constants');

// https://developer.spotify.com/documentation/web-api

module.exports = {
  data: new SlashCommandBuilder().setName('getkey').setDescription('gets the key of the track.')
  .addSubcommand(subcommand => subcommand.setName('track').setDescription('the key of the track')
    .addStringOption(option => option.setName('trackid')
    .setDescription('the id of the track from spotify that can be retrieved from the url.')
    .setRequired(true)))
  .addSubcommand(subcommand => subcommand.setName('album').setDescription('the most recurring key of the album')
    .addStringOption(option => option.setName('albumid')
    .setDescription('the id of the album from spotify that can be retrieved from the url.')
    .setRequired(true)))
  .addSubcommand(subcommand => subcommand.setName('playlist').setDescription('the the most recurring key of the playlist')
    .addStringOption(option => option.setName('playlistid')
    .setDescription('the id of the playlist from spotify that can be retrieved from the url.')
    .setRequired(true))),
  async execute(interaction, conn) {
    await interaction.deferReply();
    const { access_token } = await getSpotifyCredentials();
    const property = interaction.options._subcommand;
    const id = interaction.options.getString(`${property}id`);
    const headers = {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    };
    if (property == 'track') {
      const spotify = await axios.get(`https://api.spotify.com/v1/audio-features/${id}`, headers).then(res => res.data);
      return interaction.followUp(`The key of the track is ${musicKeys[spotify.key]} ${musicModes[spotify.mode]}`);
    } else if (property == 'album') {
      const albumSongs = await axios.get(`https://api.spotify.com/v1/albums/${id}/tracks`, headers).then(res => res.data);
      // const spotify = await axios.get(`https://api.spotify.com/v1/audio-features/${id}`, headers).then(res => res.data);
      return interaction.followUp('Under Construction');
    } else {
      return interaction.followUp('Under Construction');
    }
  }
}