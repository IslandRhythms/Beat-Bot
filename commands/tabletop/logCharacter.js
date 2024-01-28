const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

/*
If you want the Snowflake of a structure instead, grab the option via get() and access the Snowflake via the value property.
Note that you should use const { value: name } = ... here to destructure and
rename the value obtained from the CommandInteractionOption structure to avoid identifier name conflicts.

https://discordjs.guide/slash-commands/parsing-options.html#command-options
At the tip block
*/


module.exports = {
  data: new SlashCommandBuilder().setName('logcharacter').setDescription('log one of your characters')
  .addStringOption(option => option.setName('name').setDescription('Character name').setRequired(true))
  .addStringOption(option => option.setName('race').setDescription('Character Race').setRequired(true))
  .addStringOption(option => option.setName('background').setDescription('Character background').setRequired(true))
  .addBooleanOption(option => option.setName('alive').setDescription('Did you character survive their campaign?').setRequired(true))
  .addNumberOption(option => option.setName('level').setDescription('what is/was the total level of your character?').setRequired(true))
  .addStringOption(option => option.setName('groupname').setDescription('what is the name of their adventuring group?').setRequired(true))
  .addBooleanOption(option => option.setName('multiclass').setDescription('Is your character a multiclass?').setRequired(true))
  .addStringOption(option => option.setName('class').setDescription('what class(es) is your character. If more than one, separate by comma.').setRequired(true))
  .addStringOption(option => option.setName('equipment').setDescription('what equipment did your character have? Separate each item by comma.').setRequired(true))
  .addStringOption(option => option.setName('campaign').setDescription('what campaign is your character a participant?').setRequired(true))
  .addStringOption(option => option.setName('backstory').setDescription('what was your character\'s past before they became an adventurer.').setRequired(true))
  .addAttachmentOption(option => option.setName('picture').setDescription('a picture of your character'))
  .addStringOption(option => option.setName('epilogue').setDescription('what happened to your character after the adventure?'))
  .addNumberOption(option => option.setName('scores').setDescription('comma separated values in order starting with strength.'))
  .addNumberOption(option => option.setName('modifiers').setDescription('comma separated values in order starting with strength.'))
  .addAttachmentOption(option => option.setName('sheet').setDescription('The character\'s sheet')),
  async execute(interaction, conn) {
    await interaction.deferReply();
    const { GameProfile } = conn.models;
    /*
    The formula in D&D for ability modifiers is 
    (The ability score - 10) / 2 round down if positive, and round up if negative.
    */
    await interaction.followUp('Under Construction');
  }
}