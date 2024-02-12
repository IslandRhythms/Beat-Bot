const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder().setName('updatecharacter')
  .setDescription('Update a Specific character')
  .addSubcommand(subcommand => subcommand.setName('details').setDescription('details about your character i.e. trait, ideal')
    .addStringOption(option => option.setName('characterid').setDescription('the id of your character'))
    .addStringOption(option => option.setName('name').setDescription('the name of your character')))
  .addSubcommand(subcommand => subcommand.setName('build').setDescription('the stats, feats, equipment, and class breakdown of the character')
    .addStringOption(option => option.setName('characterid').setDescription('the id of your character'))
    .addStringOption(option => option.setName('name').setDescription('the name of your character')))
  .addSubcommand(subcommand => subcommand.setName('statuses').setDescription('update your character\'s statuses')
    .addStringOption(option => option.setName('characterid').setDescription('the id of your character'))
    .addStringOption(option => option.setName('name').setDescription('the name of your character'))),
  async execute(interaction, conn) {
    await interaction.deferReply({ ephemeral: true });
    const { User, Character } = conn.models;
    const sub = interaction.options._subcommand;
    const charName = interaction.options.getString('name');
    const charId = interaction.options.getString('characterid');
    /*
    if (!charName && ! charId) {
      return interaction.followUp('Please provide either the name or characterId');
    }
    */
    // still have to account for the arrays
    const schema =  { ...Character.schema.obj };
    let obj = null;
    const { _id, characterId, playerProfile, player, guildId, campaign, ...rest } = schema;

    // its ok if the subcommands have properties in common to update
    // use destructuring to parse out the fields we don't want.
    // use object.assign
    if(sub == 'details') {
      const { isAlive, isRetired, isHero, isFavorite, causeofDeath, epilogue, isMulticlass, feats, classes, equipment, stats, ...details } = rest;
      obj = details;
      obj.campaign = '';
    } else if (sub == 'build') {
      const { isAlive, isRetired, isHero, isFavorite, causeOfDeath, epilogue, backstory,
        alignment, characterImage, groupName, system, name, trait, ideal, bond, flaw, ...build } = rest;
      obj = build;
      // repopulate obj with nested stat properties
    } else {
      const { race, totalLevel, totalHP, backstory, alignment, characterImage, groupName, system, name, trait, ideal, bond, flaw,
        feats, classes, equipment, stats, XP, ...statuses } = rest;
      obj = statuses;
    }
    

    console.log('what is obj', obj);

    const selectMenuOptions = [];
    const properties = extractProperties(obj);

    // too many properties, need to break up into subcommands potentially
    for (const property of properties) {
      selectMenuOptions.push(new StringSelectMenuOptionBuilder().setLabel(property).setValue(property));
    }

    console.log('what is properties', properties);

    const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('updateCharacter')
    .setPlaceholder('Select Properties to update')
    .addOptions(selectMenuOptions)
    .setMinValues(1)
    .setMaxValues(properties.length);

    const row = new ActionRowBuilder().addComponents(selectMenu);


    const response = await interaction.followUp({ content: 'Please select Properties to Update', components: [row] });

    const collector = await response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 30_000 });
    // defer reply, do processing, send embed with updated page?
    // flip boolean properties if selected.
    collector.on('collect', async i => {
      await interaction.deleteReply();
      const selection = i.values;
      await i.reply(`You have selected ${selection}!`);
    });
  }
}

function extractProperties(obj, prefix = '') {
  const properties = [];

  for (const key in obj) {
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
          properties.push(...extractProperties(obj[key], prefix + key + '.'));
      } else {
          properties.push(prefix + key);
      }
  }

  return properties;
}