const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder().setName('updatecharacter')
  .setDescription('Update a Specific character')
  .addSubcommand(subcommand => subcommand.setName('details').setDescription('details about your character i.e. trait, ideal')
    .addStringOption(option => option.setName('characterid').setDescription('the id of your character'))
    .addStringOption(option => option.setName('name').setDescription('the name of your character')))
  .addSubcommand(subcommand => subcommand.setName('build').setDescription('the stats, feats, equipment, and class breakdown of the character')
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
    // maybe do a three way assignment i.e. const obj = {prop 1, prop2} = Character.schema.obj
    // makes it so that instead of deleting what we're not using, we just have what we are using.
    const obj = Character.schema.obj;
    delete obj._id;
    delete obj.characterId;
    delete obj.playerProfile;
    delete obj.player;
    delete obj.guildId;
    delete obj.campaign;
    // its ok if the subcommands have properties in common to update
    if(sub == 'details') {
      delete obj.isMulticlass;
      delete obj.feats;
      delete obj.classes;
      delete obj.equipment;
      delete obj.stats;
      obj.campaign = '';
    } else {
      delete obj.isAlive;
      delete obj.isRetired;
      delete obj.isHero;
      delete obj.isFavorite;
      delete obj.causeOfDeath;
      delete obj.epilogue;
      delete obj.backstory;
      delete obj.alignment;
      delete obj.characterImage;
      delete obj.groupName;
      delete obj.system;
      delete obj.name;
      delete obj.trait;
      delete obj.ideal;
      delete obj.bond;
      delete obj.flaw;
      // repopulate obj with nested stat properties
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