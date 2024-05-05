'use strict';

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');


module.exports = {
  data: new SlashCommandBuilder().setName('oftheday').setDescription('get one of daily curated selections')
  .addSubcommand(subcommand => subcommand.setName('animal').setDescription('get information on the animal of the day'))
  .addSubcommand(subcommand => subcommand.setName('artwork').setDescription('get the artwork of the day'))
  .addSubcommand(subcommand => subcommand.setName('astropic').setDescription('get the daily nasa photo'))
  .addSubcommand(subcommand => subcommand.setName('book').setDescription('get the book of the day'))
  .addSubcommand(subcommand => subcommand.setName('country').setDescription('get information about the country of the day'))
  .addSubcommand(subcommand => subcommand.setName('fact').setDescription('get the fact of the day'))
  .addSubcommand(subcommand => subcommand.setName('joke').setDescription('get the joke of the day'))
  .addSubcommand(subcommand => subcommand.setName('meme').setDescription('get the meme of the day'))
  .addSubcommand(subcommand => subcommand.setName('moonphase').setDescription('get today\'s moon phase'))
  .addSubcommand(subcommand => subcommand.setName('number').setDescription('get the number of the day'))
  .addSubcommand(subcommand => subcommand.setName('onthisday').setDescription('get what the daily what happened on this day'))
  .addSubcommand(subcommand => subcommand.setName('plant').setDescription('get information on the plant of the day'))
  .addSubcommand(subcommand => subcommand.setName('poem').setDescription('get the poem of the day'))
  .addSubcommand(subcommand => subcommand.setName('pokemon').setDescription('get the pokemon of the day'))
  .addSubcommand(subcommand => subcommand.setName('puzzle').setDescription('get the puzzle of the day'))
  .addSubcommand(subcommand => subcommand.setName('riddle').setDescription('get the riddle of the day'))
  .addSubcommand(subcommand => subcommand.setName('song').setDescription('get the song of the day'))
  .addSubcommand(subcommand => subcommand.setName('word').setDescription('get detailed information on the word of the day')),
  async execute(interaction, conn) {
    await interaction.deferReply({ ephemeral: true });
    const { Daily } = conn.models;
    const doc = await Daily.findOne().sort({ createdAt: -1 });
    const sub = interaction.options._subcommand;
    await interaction.followUp(`Under Construction`);
  }
}