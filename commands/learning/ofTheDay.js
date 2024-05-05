'use strict';

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');


module.exports = {
  data: new SlashCommandBuilder().setName('oftheday').setDescription('get one of daily curated selections')
  .addSubcommand(subcommand => subcommand.setName('animalOTD').setDescription('get information on the animal of the day'))
  .addSubcommand(subcommand => subcommand.setName('artworkOTD').setDescription('get the artwork of the day'))
  .addSubcommand(subcommand => subcommand.setName('astropicOTD').setDescription('get the daily nasa photo'))
  .addSubcommand(subcommand => subcommand.setName('bookOTD').setDescription('get the book of the day'))
  .addSubcommand(subcommand => subcommand.setName('countryOTD').setDescription('get information about the country of the day'))
  .addSubcommand(subcommand => subcommand.setName('factOTD').setDescription('get the fact of the day'))
  .addSubcommand(subcommand => subcommand.setName('jokeOTD').setDescription('get the joke of the day'))
  .addSubcommand(subcommand => subcommand.setName('memeOTD').setDescription('get the meme of the day'))
  .addSubcommand(subcommand => subcommand.setName('moonPhase').setDescription('get today\'s moon phase'))
  .addSubcommand(subcommand => subcommand.setName('numberOTD').setDescription('get the number of the day'))
  .addSubcommand(subcommand => subcommand.setName('onthisday').setDescription('get what the daily what happened on this day'))
  .addSubcommand(subcommand => subcommand.setName('plantOTD').setDescription('get information on the plant of the day'))
  .addSubcommand(subcommand => subcommand.setName('poemOTD').setDescription('get the poem of the day'))
  .addSubcommand(subcommand => subcommand.setName('pokemonOTD').setDescription('get the pokemon of the day'))
  .addSubcommand(subcommand => subcommand.setName('puzzleOTD').setDescription('get the puzzle of the day'))
  .addSubcommand(subcommand => subcommand.setName('riddleOTD').setDescription('get the riddle of the day'))
  .addSubcommand(subcommand => subcommand.setName('songOTD').setDescription('get the song of the day'))
  .addSubcommand(subcommand => subcommand.setName('wordOTD').setDescription('get detailed information on the word of the day')),
  async execute(interaction, conn) {
    await interaction.deferReply();
    const { Daily } = conn.models;
    const doc = await Daily.findOne().sort({ createdAt: -1 });
    const sub = interaction.options._subcommand;
    await interaction.followUp(`Under Construction`);
  }
}