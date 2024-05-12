'use strict';
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const puppeteer = require('puppeteer');

module.exports = {
  data: new SlashCommandBuilder().setName('apex').setDescription('get apex esport information')
  .addStringOption(option => option.setName('season').setDescription('the season you wish to look up')
  .addStringOption(option => option.setName('stage').setDescription('the stage you wish to look up')
  .addChoices(
    { name: 'Split 1', value: '' },
    { name: 'Split 1 Playoffs', value: '' },
    { name: 'Split 2', value: '' },
    { name: 'Split 2 Qualifier', value: '' },
    { name: 'Split 2 Playoffs', value: '' },
    { name: 'Last Change Qualifier', value: '' },
    { name: 'Championship', value: '' }
  ))
  ),
  async execute(interaction) {

  }
}