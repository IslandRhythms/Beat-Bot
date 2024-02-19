const { SlashCommandBuilder, 
  ActionRowBuilder, 
  StringSelectMenuBuilder, 
  StringSelectMenuOptionBuilder, 
  ComponentType, 
  ModalBuilder, 
  TextInputBuilder, TextInputStyle, } = require('discord.js');


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
   const user = await User.findOne({ discordId: interaction.user.id });
   const character = await Character.findOne({ player: user._id, $or: [{ name: charName, characterId: charId }]});
   /*
   if (!character) {
    return interaction.followUp('character not found');
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
    const arrayProperties = ['classes', 'feats', 'equipment'];

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
    // Re: Solution One, maybe do the indication of removing or adding from the array here? Need list of array properties and go from there.
    const response = await interaction.followUp({ content: 'Please select Properties to Update', components: [row] });

    const collector = await response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, filter: (i) => i.user.id === interaction.user.id, time: 30_000 });

    collector.on('collect', async i => {
      await interaction.deleteReply();
      const selection = i.values; // array
      const modal = new ModalBuilder().setTitle('Update Character Information').setCustomId('CharacterUpdateModal');
      const obj = {};
      for (const property of selection) {
        if (property.startsWith('is')) {
          // omit from the modal if the property is a boolean property i.e. starts with is
          obj[property] = !character[property]; // flip the boolean
          continue;
        }
        // How do we handle arrays finally?
        if (arrayProperties.includes(property)) {
          // Solution One: keep a list of fields that are arrays, if one is detected, add another field to indicate if we are removing or adding fields.
          // Maybe figure out a way to show what the current values are in the field?
          const line = new TextInputBuilder().setCustomId(`${property}Operation`).setLabel(`Do you wish to 1. add or 2. remove from ${property}?`).setStyle(TextInputStyle.Short);
          modal.addComponents(new ActionRowBuilder().addComponents(line));
          // use placeholder() to indicate how they should type it in. 
          const input = new TextInputBuilder().setCustomId(property).setLabel(`Please enter a new value for ${property}`).setStyle(TextInputStyle.Paragraph);
          const row = new ActionRowBuilder().addComponents(input);
          modal.addComponents(row);
        } else {
          const input = new TextInputBuilder().setCustomId(property).setLabel(`Please enter a new value for ${property}`).setStyle(TextInputStyle.Paragraph);
          const row = new ActionRowBuilder().addComponents(input);
          modal.addComponents(row);
        }
      }
      await i.showModal(modal);
      collector.stop('modal received, error statement will handle from here');
      // doesn't seem like there is a way to forcibly close the modal if there is a timeout. User will just have to close on their end.
      await interaction.awaitModalSubmit({ time: 60_000 }).then(async (modalInteraction) => {
        console.log('what is res', modalInteraction);
        await modalInteraction.reply({ content: 'Updates received', ephemeral: true });
        // process fields and there values, attach to an obj, then set that in the character doc
        // need to account for if arrays were selected
        for ( const [fieldname, field] of modalInteraction.fields.fields.entries()) {
          if (arrayProperties.includes(fieldname)) {

          } else {
            obj[fieldname] = field.value;
          }
        }
        character.set(obj);
        await character.save();
      }).catch(e => { 
        console.log('what is error', e)
      });
    });
    // easiest solution is to just get rid of this
    collector.on('end', async (collected, reason) => {
      if (reason == 'time') {
        await interaction.channel.send('Time ran out. Please try again.')
      }
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