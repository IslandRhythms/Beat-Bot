const { SlashCommandBuilder } = require('discord.js');
const { uniqueNamesGenerator, adjectives, animals, colors, countries, names, languages, starWars } = require('unique-names-generator');

const options = {A: {name: 'adjectives', value: 'adjectives'},
  B: {name: 'animals', value: 'animals'},
  C: {name: 'color', value: 'colors'},
  D: {name: 'countries', value: 'countries'},
  E: {name: 'names', value: 'names'},
  F: {name: 'languages', value: 'languages'},
  G: {name: 'star wars', value: 'starWars'},
};

const dics = {
  adjectives: adjectives,
  animals: animals,
  color: colors,
  countries: countries,
  names: names,
  languages: languages,
  starWars: starWars,
};

module.exports = {
  data: new SlashCommandBuilder().setName('genname')
  .setDescription('generates a random name from the given dictionaries to use.')
  .addStringOption(option => option.setName('first').setDescription('the first option').setRequired(true).addChoices(options.A, options.B, options.C, options.D, options.E, options.F, options.G))
  .addStringOption(option => option.setName('second').setDescription('the second option').addChoices(options.A, options.B, options.C, options.D, options.E, options.F, options.G))
  .addStringOption(option => option.setName('third').setDescription('the third option').addChoices(options.A, options.B, options.C, options.D, options.E, options.F, options.G))
  .addStringOption(option => option.setName('fourth').setDescription('the fourth option').addChoices(options.A, options.B, options.C, options.D, options.E, options.F, options.G))
  .addStringOption(option => option.setName('fifth').setDescription('the fifth option').addChoices(options.A, options.B, options.C, options.D, options.E, options.F, options.G))
  .addStringOption(option => option.setName('sixth').setDescription('the sixth option').addChoices(options.A, options.B, options.C, options.D, options.E, options.F, options.G))
  .addStringOption(option => option.setName('seventh').setDescription('the seventh option').addChoices(options.A, options.B, options.C, options.D, options.E, options.F, options.G)),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const first = interaction.options.getString('first');
    const second = interaction.options.getString('second') ?? '';
    const third = interaction.options.getString('third') ?? '';
    const fourth = interaction.options.getString('fourth') ?? '';
    const fifth = interaction.options.getString('fifth') ?? '';
    const sixth = interaction.options.getString('sixth') ?? '';
    const seventh = interaction.options.getString('seventh') ?? '';
    const opts = [first, second, third, fourth, fifth, sixth, seventh];
    const dictionaries = [];
    for(let i = 0; i < opts.length; i++) {
      if (opts[i] != '') {
        dictionaries.push(dics[opts[i]]);
      }
    }
    // there was an error where it couldn't read the length for whatever reason, can't reproduce though.
    const name = uniqueNamesGenerator({
      dictionaries: dictionaries,
      length: dictionaries.length,
      separator: ' '
    });
    return interaction.followUp(`Generated name is: ${name}`);
  }
}