const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const parseRollTwentySheet = require('../../helpers/parseRollTwentySheet');
const parseHtmlPage = require('../../helpers/parseHtmlPage');
const { DNDAdvancement } = require('../../resources/constants');
const { Pagination } = require('pagination.djs');

module.exports = {
  data: new SlashCommandBuilder().setName('uploadcharacter').setDescription('upload one of your characters')
  .addAttachmentOption(option => option.setName('sheet').setDescription('The character\'s sheet').setRequired(true))
  .addStringOption(option => option.setName('source').setDescription('where was this file generated from?').addChoices(
    { name: 'Roll20', value: 'Roll20'},
    { name: 'html from command', value: 'html'}
  ).setRequired(true))
  .addStringOption(option => option.setName('campaignid').setDescription('what campaign is your character a participant?').setRequired(true))
  .addStringOption(option => option.setName('system').setDescription('what system was your character played in?').addChoices(
    { name: 'Dungeons and Dragons', value: 'D&D' },
    { name: 'Pathfinder', value: 'Pathfinder' }
  ).setRequired(true))
  .addBooleanOption(option => option.setName('alive').setDescription('Did you character survive their campaign?').setRequired(true))
  .addStringOption(option => option.setName('groupname').setDescription('what is the name of their adventuring group?')) // could have a character without a group name yet
  .addAttachmentOption(option => option.setName('picture').setDescription('a picture of your character'))
  .addStringOption(option => option.setName('backstory').setDescription('what was your character\'s past before they became an adventurer.'))
  .addStringOption(option => option.setName('epilogue').setDescription('what happened to your character after the adventure?')),
  async execute(interaction, conn) {
    const pagination = new Pagination(interaction);
    await interaction.deferReply();
    const { GameProfile, User, Character, Campaign } = conn.models;
    const campaignId = interaction.options.getString('campaignid');
    const campaign = await Campaign.findOne({ $or: [{ _id: campaignId }, { campaignId: campaignId }]});
    if (!campaign) {
      return interaction.followUp('Your player character must be in a valid campaign.');
    }
    const sheet = interaction.options.getAttachment('sheet');
    const source = interaction.options.getString('source');
    const user = await User.findOne({ discordId: interaction.user.id });
    const gameProfile = await GameProfile.findOne({ player: user._id });
    console.log('what is sheet', sheet); // make sure to delete sheet after the command finishes
    let obj = null;
    if (source == 'Roll20' && sheet.contentType == 'application/pdf') {
      obj = await parseRollTwentySheet(sheet);
    } else if (source == 'html' && sheet.contentType.includes('text/html')) {
      obj = await parseHtmlPage(sheet);
    } else {
      return interaction.followUp('Please ensure the uploaded file type is one that this command supports.')
    }
    obj.epilogue = interaction.options.getString('epilogue');
    obj.isAlive = interaction.options.getBoolean('alive');
    if (source == 'Roll20') {
      obj.backStory = interaction.options.getString('backstory');
    }
    if (interaction.options.getString('picture')) {
      obj.characterImage = interaction.options.getString('picture').url;
    }
    obj.groupName = interaction.options.getString('groupname');
    obj.player = user._id;
    obj.playerProfile = gameProfile._id;
    obj.campaign = campaign._id;
    obj.system = interaction.options.getString('system');
    obj.totalLevel = DNDAdvancement.findLastIndex(x => parseInt(obj.XP) >= x) + 1;
    const numCharacters = await Character.countDocuments();
    obj.characterId = `${obj.name.replace(/\s+/g, '')}-${numCharacters + 1}`;
    const character = await Character.create({...obj});
    gameProfile.playerCharacters.push(character._id)
    await gameProfile.save();
    const embeds = [];
    const embed = new EmbedBuilder().setTitle(`New Character Created! ID ${character.characterId}`);
    embed.setDescription(character.backStory)
    embed.addFields({ name: 'Name', value: character.name });
    embed.addFields({ name: 'Adventuring Group', value: character.groupName, inline: true });
    embed.addFields({ name: 'Alive?', value: character.isAlive, inline: true });
    embed.addFields({ name: 'Retired?', value: character.isRetired, inline: true });
    embed.addFields({ name: 'Hero?', value: character.isHero, inline: true });
    embed.addFields({ name: 'Background', value: character.background, inline: true });
    embed.addFields({ name: 'Race', value: character.race, inline: true });
    embed.addFields({ name: 'Alignment', value: character.alignment, inline: true });
    embed.addFields({ name: 'Trait', value: character.trait, inline: true });
    embed.addFields({ name: 'Ideal', value: character.ideal, inline: true });
    embed.addFields({ name: 'Bond', value: character.bond, inline: true });
    embed.addFields({ name: 'Flaw', value: character.flaw, inline: true });
    embed.addFields({ name: 'System', value: character.system, inline: true });
    if (character.isMulticlass) {
      const classEmbed = new EmbedBuilder().setTitle(`${character.name} Multiclass breakdown`);
      for (let i = 0; i < character.classes.length; i++) {
        classEmbed.addFields({ name: 'Class', value: `${character.classes[i].name} ${character.classes[i].level}` });
      }
      embeds.push(classEmbed);
    } else {
      embed.addFields({ name: 'Class', value: character.classes[0].name });
    }
    embeds.push(embed);
    const statEmbed = new EmbedBuilder().setTitle(`${character.name} Stats and Feats`);
    statEmbed.addFields({ name: 'HP', value: character.totalHP, inline: true });
    statEmbed.addFields({ name: 'Level', value: character.totalLevel, inline: true });
    statEmbed.addFields({ name: 'XP', value: character.XP, inline: true });
    const keys = Object.keys(character.stats);
    for (let i = 0; i < keys.length; i++) {
      statEmbed.addFields({ name: keys[i], value: `${character.stats[keys[i]].modifier}/${character.stats[keys[i]].score}`, inline: true });
    }
    for (let i = 0; i < character.feats.length; i++) {
      statEmbed.addFields({ name: 'Feat', value: character.feats[i], inline: true });
    }
    embeds.push(statEmbed);

    if (character.epilogue) {
      const epilogueEmbed = new EmbedBuilder().setTitle(`${character.name} Epilogue`).setDescription(character.epilogue);
      embeds.push(epilogueEmbed);
    } else if (character.causeOfDeath) {
      const deathEmbed = new EmbedBuilder().setTitle(`${character.name} Cause of Death`).setDescription(character.causeOfDeath);
      embeds.push(deathEmbed);
    }


    pagination.setEmbeds(embeds, (currentEmbed, index, array) => {
      if (character.characterImage) {
        currentEmbed.setThumbnail(character.characterImage);
      }
      return currentEmbed.setFooter({ text: `Character Id ${character.characterId}`});
    });

    pagination.setOptions({ ephemeral: true });

    pagination.render();
  }
}