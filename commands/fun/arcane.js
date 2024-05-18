const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  cooldown: 60,
  data: new SlashCommandBuilder().setName('arcane')
  .setDescription('Get magic related stuff (taken from harry potter)')
  .addSubcommand(subcommand => subcommand.setName('elixirs').setDescription('get a potion/elixir'))
  .addSubcommand(subcommand => subcommand.setName('ingredients').setDescription('get an ingredient for a potion/elixir'))
  .addSubcommand(subcommand => subcommand.setName('spells').setDescription('get a spell name')
    .addStringOption(option => option.setName('type').setDescription('the type of the spell')
    .addChoices(
      { name: 'Charm', value: 'charm' },
      { name: 'Conjuration', value: 'conjuration' },
      { name: 'Spell', value: 'spell' },
      { name: 'Transfiguration', value: 'transfiguration' },
      { name: 'Healing Spell', value: 'healingspell' },
      { name: 'Dark Charm', value: 'darkcharm' },
      { name: 'Jinx', value: 'jinx' },
      { name: 'Curse', value: 'curse' },
      { name: 'Magical Transportation', value: 'magicaltransportation' },
      { name: 'Hex', value: 'hex' },
      { name: 'Counterspell', value: 'counterspell' },
      { name: 'Dark Arts', value: 'darkarts' },
      { name: 'Counter Jinx', value: 'counterjinx' },
      { name: 'Counter Charm', value: 'counter charm' },
      { name: 'Untransfiguration', value: 'untransfiguration' },
      { name: 'Binding Magical Contract', value: 'bindingmagicalcontract' },
      { name: 'Vanishment', value: 'vanishment' },
      { name: 'None', value: 'none'}
    ))
  ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    let url = `https://wizard-world-api.herokuapp.com/`;
    const path = interaction.options._subcommand;
    if (path == 'spells') {
      url += `${path}`;
      const type = interaction.options.getString('type');
      if (type) {
        url += `?type=${type}`;
      }
    } else {
      url += path;
    }
    const res = await axios.get(url).then(res => res.data);
    const index = Math.floor(Math.random() * res.length)
    const selectedResult= res[index];
    const embed = new EmbedBuilder().setTitle(selectedResult.name);
    if (path == 'spells') {
      embed.setDescription(`${selectedResult.incantation ? `The incantation is ${selectedResult.incantation}.` : `No incantantion required.`} Illicits an effect that ${selectedResult.effect}`);
      embed.addFields(
        { name: 'Spell Type', value: selectedResult.type, inline: true },
        { name: 'Spell Color', value: selectedResult.light, inline: true }
      )
    } else if (path == 'elixirs') {
      embed.setDescription(`${selectedResult.effect}. ${selectedResult.sideEffects ?? 'No known side effects'}.`);
      embed.addFields({ name: 'Difficulty', value: selectedResult.difficulty });

      for (let i = 0; i < selectedResult.ingredients.length; i++) {
        embed.addFields({ name: 'Ingredient', value: selectedResult.ingredients[i].name, inline: true })
      }
    }
    
    await interaction.followUp({ embeds: [embed] });
  }
}