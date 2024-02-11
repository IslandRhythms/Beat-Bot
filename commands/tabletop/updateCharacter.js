const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, StringSelectMenuInteraction } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder().setName('updatecharacterproperties')
  .setDescription('Update a Specific character')
  .addStringOption(option => option.setName('characterid').setDescription('the id of your character'))
  .addStringOption(option => option.setName('name').setDescription('the name of your character')),
  async execute(interaction, conn) {
    await interaction.deferReply();
    const { User, Character } = conn.models;
    // need to decide how to break this up. Could combine two commands into 1 command with 2 subcommands and then delete different properties depending on the selection.
    // still have to account for the arrays
    const obj = Character.schema.obj;
    delete obj._id;
    delete obj.characterId;
    delete obj.playerProfile;
    delete obj.player;
    delete obj.guildId;
    delete obj.isAlive;
    delete obj.isRetired;
    delete obj.isHero;
    delete obj.isFavorite;
    delete obj.isMulticlass;
    delete obj.feats;
    delete obj.classes;
    delete obj.equipment;
    delete obj.campaign;
    delete obj.stats;
    obj.campaign = '';

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

    const collector = response.createMessageComponentCollector({ componentType: StringSelectMenuInteraction.StringSelect, time: 60_000 });

    collector.on('collect', async i => {
      const selection = i.values;
      await i.reply(`${i.user} has selected ${selection}!`);
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