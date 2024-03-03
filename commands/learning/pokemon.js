const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const capitalizeFirstLetter = require('../../helpers/capitalizeFirstLetter');

// https://discord.js.org/#/docs/builders/main/class/SlashCommandBuilder?scrollTo=addMentionableOption

module.exports = {
  data: new SlashCommandBuilder().setName('pokemon')
  .setDescription('Get information about a pokemon')
  .addStringOption(option => option.setName('pokemon').setDescription('the pokemon name or national dex id').setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply();
    const pokemon = interaction.options.getString('pokemon');
    const embed = new EmbedBuilder();
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`).then(res => res.data);
    // two different payloads
    const pokedex = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${res.name}`).then(res => res.data);
    const nationalDex = pokedex.pokedex_numbers.find(x => x.pokedex.name == 'national');
    let evolvesFrom = '';
    const name = capitalizeFirstLetter(res.name);
    if (pokedex.evolves_from_species != null) {
      evolvesFrom = `${name}, the evolved form of ${pokedex.evolves_from_species.name}. `
    }
    embed.setAuthor({ name: 'pokeapi', iconURL: 'https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_64.png', url: 'https://pokeapi.co/' });
    const genus = pokedex.genera.find(x => x.language.name == 'en');
    embed.setTitle(`${name}, The ${genus.genus}. `);
    embed.setDescription(`${evolvesFrom}${pokedex.flavor_text_entries[0].flavor_text}`);
    for (let i = 0; i < res.types.length;i++) {
      embed.addFields({ name: 'Type', value: res.types[i].type.name, inline: true });
    }
    embed.addFields({ name: 'National Dex Number', value: nationalDex.entry_number.toString() });
    embed.setImage(res.sprites.front_default);
    embed.setFooter({ text: 'Possible thanks to the pokemon api https://pokeapi.co/' });
    await interaction.followUp({ embeds: [embed] })
  }
}