'use strict';

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
require('../../config');
const axios = require('axios');
const { Pagination } = require('pagination.djs');
const capitalizeFirstLetter = require('../../helpers/capitalizeFirstLetter');

module.exports = {
  data: new SlashCommandBuilder().setName('oftheday').setDescription('get one of daily curated selections')
  .addSubcommand(subcommand => subcommand.setName('animal').setDescription('get information on the animal of the day'))
  .addSubcommand(subcommand => subcommand.setName('artwork').setDescription('get the artwork of the day'))
  .addSubcommand(subcommand => subcommand.setName('astropic').setDescription('get the daily nasa photo'))
  .addSubcommand(subcommand => subcommand.setName('book').setDescription('get the book of the day'))
  .addSubcommand(subcommand => subcommand.setName('country').setDescription('get information about the country of the day'))
  .addSubcommand(subcommand => subcommand.setName('fact').setDescription('get the fact of the day'))
  .addSubcommand(subcommand => subcommand.setName('joke').setDescription('get the joke of the day'))
  .addSubcommand(subcommand => subcommand.setName('meme').setDescription('get the meme of the day'))
  .addSubcommand(subcommand => subcommand.setName('moonphase').setDescription('get today\'s moon phase'))
  .addSubcommand(subcommand => subcommand.setName('number').setDescription('get the number of the day'))
  .addSubcommand(subcommand => subcommand.setName('onthisday').setDescription('get what the daily what happened on this day'))
  .addSubcommand(subcommand => subcommand.setName('plant').setDescription('get information on the plant of the day'))
  .addSubcommand(subcommand => subcommand.setName('poem').setDescription('get the poem of the day'))
  .addSubcommand(subcommand => subcommand.setName('pokemon').setDescription('get the pokemon of the day'))
  .addSubcommand(subcommand => subcommand.setName('puzzle').setDescription('get the puzzle of the day'))
  .addSubcommand(subcommand => subcommand.setName('riddle').setDescription('get the riddle of the day'))
  .addSubcommand(subcommand => subcommand.setName('song').setDescription('get the song of the day'))
  .addSubcommand(subcommand => subcommand.setName('word').setDescription('get detailed information on the word of the day')),
  async execute(interaction, conn) {
    const pagination = new Pagination(interaction);
    await interaction.deferReply({ ephemeral: true });
    const { Daily } = conn.models;
    const doc = await Daily.findOne().sort({ createdAt: -1 });
    const sub = interaction.options._subcommand;
    const embed = new EmbedBuilder();
    if (sub == 'animal') {
      const animal = doc[`${sub}OTD`];
      embed.setTitle(`Animal of the Day: ${animal.scientificName}, commonly known as ${animal.name}`)
        .setDescription(`${animal.briefSummary}`)
        .setImage(`${animal.image}`)
        .setURL(`${animal.link}`)
        .addFields({ name: 'Fun Fact', value: `${animal.funFact}`});
        return interaction.followUp({ embeds: [embed] });
    } else if (sub == 'artwork') {
      const metEmbed = new EmbedBuilder()
      .setTitle(doc.artOTD.metTitle ?? `No title found`)
      .setAuthor({ name: doc.artOTD.metArtist ?? 'No artist found'})
      .setImage(doc.artOTD.metImageLink ?? `No image found`);
      const chicagoEmbed = new EmbedBuilder()
      .setTitle(doc.artOTD.chicagoTitle ?? `No title found`)
      .setAuthor({ name: doc.artOTD.chicagoArtist ?? `No artist found`})
      .setImage(doc.artOTD.chicagoImageLink ?? `No image found`);
      return interaction.followUp({ embeds: [metEmbed, chicagoEmbed ] });
    }
    else if (sub == 'astropic') {
      embed.setTitle(`Astropic of the Day: ${doc.astropicOTD.title}`)
      .setDescription(`${doc.astropicOTD.description}`)
      .setImage(`${doc.astropicOTD.url}`)

      return interaction.followUp({ embeds: [embed] });
    }
    else if (sub == 'book') {
      const url = `https://openlibrary.org${doc.bookOTD.bookRoute}`
      const data = await axios.get(url).then(res => res.data);
      const bookIdParts = doc.bookOTD.bookRoute.split('/');
      const bookId = bookIdParts[bookIdParts.length - 1];
      embed
        .setTitle(data.title)
        .setImage(`https://covers.openlibrary.org/b/olid/${bookId}-M.jpg`);
      if (data.description) {
        embed.setDescription(data.description.value)
      }
      for (let i = 0; i < data.subjects.length; i++) {
        embed.addFields({ name: 'Subject', value: data.subjects[i], inline: true })
      }
      return interaction.followUp({ embeds: [embed] })
    }
    else if (sub == 'country') {
      const country = doc.countryOTD;
      const countryData = await axios.get(`https://restcountries.com/v3.1/name/${country}?fullText=true`).then(res => res.data[0])
      embed.setTitle(`${countryData.name.official}`).setImage(countryData.coatOfArms.png).setAuthor({ name: countryData.name.common, iconURL: countryData.flags.png });
      // needs work
      // fields descriptions https://gitlab.com/restcountries/restcountries/-/blob/master/FIELDS.md

      let languageProps = Object.keys(countryData.languages);
      let languages = [];
      for (let i = 0; i < languageProps.length; i++) {
        languages.push(countryData.languages[languageProps[i]])
      }
      let borders = [];
      if (countryData.borders) {
        for (let i = 0; i < countryData.borders.length; i++) {
          borders.push(countryData.borders[i]);
        }
      }
      const description = `
      ${countryData.name.official} is located on the ${countryData.continents.length > 1 ? `continents` : `continent`} of ${countryData.continents.join(' and ')} in the ${countryData.region}, specifically the ${countryData.subregion}.
      The capital ${countryData.capital.length > 1 ? `cities are` : `city is`} ${countryData.capital.join(' and ')} and they begin their week on ${countryData.startOfWeek}. ${borders.length ? `The country is bordered by ${borders.join(' and ')}` : ''}
      Someone from this country would be called ${countryData.demonyms.eng.m}, most likely speak ${languages.join(' or ')} and would drive on the ${countryData.car.side} side of the road.
      ${countryData.flags.alt}
      `;
      embed.setDescription(description);
      embed.addFields(
        { name: 'Landlocked', value: `${countryData.landlocked}`, inline: true },
        { name: 'UN Member', value: `${countryData.unMember}`, inline: true },
        { name: 'Population', value: `${countryData.population}`, inline: true },
        { name: 'Independent', value: `${countryData.independent}`, inline: true },
        { name: 'CCA2 code', value: countryData.cca2, inline: true },
        { name: 'CCA3 code', value: countryData.cca3, inline: true }, 
        { name: 'CCN3 code', value: countryData.ccn3, inline: true },
        { name: 'Google Map View', value: countryData.maps.googleMaps, inline: true }
      );
      const keys = Object.keys(countryData.currencies);
      for (let i = 0; i < keys.length; i++) {
        embed.addFields({ name: 'Currency', value: `Name: ${countryData.currencies[keys[i]].name} / Symbol **${countryData.currencies[keys[i]].symbol}**`, inline: true })
      }
      for (let i = 0; i < countryData.timezones.length; i++) {
        const offsetString = countryData.timezones[i];
        const date = new Date();
        const offset = (date.getTimezoneOffset() / 60) * -1; // Convert to hours and invert sign
        const timeZone = `GMT${offsetString.replace("UTC", "")} (Time Zone Offset: ${offset})`;

        embed.addFields({ name: 'Timezone', value: timeZone, inline: true })
      }
      return interaction.followUp({ embeds: [embed] })
    }
    else if (sub == 'fact') {
      embed.setTitle(`Fact of the Day`).setDescription(`${doc.factOTD.fact} - Source: ${doc.factOTD.source}`);
      return interaction.followUp({ embeds: [embed] })
    }
    else if (sub == 'joke') {
      embed.setTitle('Joke of the Day');
      if (doc.jokeOTD.setup) {
        embed.setDescription(`${doc.jokeOTD.setup} || ${doc.jokeOTD.delivery} ||`)
      } else {
        embed.setDescription(`${doc.jokeOTD.joke}`);
      }
      return interaction.followUp({ embeds: [embed] });
    }
    else if (sub == 'meme') {
      embed.setTitle('Meme of the Day')
      .setImage(`${doc.memeOTD}`)
      return interaction.followUp({ embeds: [embed] })
    }
    else if (sub == 'moonphase') {
      embed.setTitle(`Today's moon phase: ${doc.phaseOfTheMoon.phase} ${doc.phaseOfTheMoon.moon}`)
      return interaction.followUp({ embeds: [embed] });
    }
    else if (sub == 'number') {
      embed.setTitle(`Number of the Day: ${doc.numberOTD}`);
      return interaction.followUp({ embeds: [embed] });
    }
    else if (sub == 'onthisday') {
      embed.setTitle(`History of the Day`).setDescription(`${doc.historyOTD}`);
      return interaction.followUp({ embeds: [embed] });
    }
    else if (sub == 'plant') {
      const data = await axios.get(`https://perenual.com/api/species/details/${doc.plantOTD.id}?key=${process.env.PLANTAPIKEY}`).then(res => res.data);
      embed
        .setTitle(`${data.scientific_name[0]}, commonly known as ${data.common_name}`)
        .setDescription(`Also known as ${data.other_name.join(',')}. ${data.description}`)
        .setImage(data.default_image.original_url)
        .addFields(
          { name: 'Plant Type', value: data.type, inline: true },
          { name: 'Edibile Fruit', value: data.edible_fruit, inline: true },
          { name: 'Attracts', value: data.attracts.join(','), inline: true },
          { name: 'Poisonous to Humans', value: data.poisonous_to_humans, inline: true },
          { name: 'Poisonous to Pets', value: data.poisonous_to_pets, inline: true },
          { name: 'Medical', value: data.medicinal, inline: true },
          { name: 'Rare', value: data.rare, inline: true },
          { name: 'Cuisine', value: data.cuisine, inline: true },
          { name: 'Maintenance', value: data.maintenance, inline: true },
          { name: 'Indoor', value: data.indoor, inline: true },
          { name: 'Tropical', value: data.tropical, inline: true },
          { name: 'Thorny', value: data.thorny, inline: true }
        )
      return interaction.followUp({ embeds: [embed] })
    }
    else if (sub == 'poem') {
      const res = await axios.get(`https://poetrydb.org/title,author/${doc.poemOTD.title};${doc.poemOTD.author}`).then(res => res.data);
      const poem = res[0];
      embed
      .setTitle(`${poem.title}`)
      .setAuthor({ name: `${poem.author}`})
      .setDescription(`${poem.lines.join('\n')}`)
      return interaction.followUp({ embeds: [embed] })
    }
    else if (sub == 'pokemon') {
      const pokemon = doc.pokemonOTD;
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
      embed.setTitle(`Pokemon of the Day: ${name}, The ${genus.genus}. `);
      embed.setDescription(`${evolvesFrom}${pokedex.flavor_text_entries[0].flavor_text}`);
      for (let i = 0; i < res.types.length;i++) {
        embed.addFields({ name: 'Type', value: res.types[i].type.name, inline: true });
      }
      embed.addFields({ name: 'National Dex Number', value: nationalDex.entry_number.toString() });
      embed.setImage(res.sprites.front_default);
      embed.setFooter({ text: 'Possible thanks to the pokemon api https://pokeapi.co/' });
      return interaction.followUp({ embeds: [embed] })
    }
    else if (sub == 'puzzle') {
      embed.setTitle(`Puzzle of the Day`).setURL(`${doc.puzzleOTD}`);
      return interaction.followUp({ embeds: [embed] });
    }
    else if (sub == 'riddle') {
      embed.setTitle(`Riddle of the Day: ${doc.riddleOTD.riddle}`)
      .setDescription(`|| ${doc.riddleOTD.answer} ||`)
      return interaction.followUp({ embeds: [embed] });
    }
    else if (sub == 'song') {
      embed.setTitle(`Song of the Day: ${doc.songOTD.name} by ${doc.songOTD.artist}`)
      .setImage(doc.songOTD.image)
      .setURL(doc.songOTD.url)
      .addFields({ name: 'Genre', value: `${doc.songOTD.genre}` });
      return interaction.followUp({ embeds: [embed] });
    }
    else if (sub == 'word') {
      const pagination = new Pagination(interaction);
      const wordOfTheDay = doc.wordOTD;
      let err = null;
      const information = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${wordOfTheDay}`).then(res => res.data).catch(error => {
        err = error;
        return error;
      });
      if (err) {
        if (err.response && err.response.data) {
          embed.setTitle(`${err.response.data.title}`).setDescription(`${err.response.data.message} ${err.response.data.resolution}`)
        } else {
          embed.setTitle(`Something went wrong`)
        }
        return interaction.followUp({ embeds: [embed] });
      }
      const embeds = [];
      const synonyms = [];
      const antonyms = [];
      for (let i = 0; i < information.length; i++) {
        const phonetics = information[i].phonetics.map(x => x.text).join(' or ');
        for (let index = 0; index < information[i].meanings.length; index++) {
          const newEmbed = new EmbedBuilder();
          const definitions = information[i].meanings[index].definitions;
          let description = `**${capitalizeFirstLetter(wordOfTheDay)}. ${capitalizeFirstLetter(information[i].meanings[index].partOfSpeech)}. (${phonetics})**\n`;
          synonyms.push(...information[i].meanings[index].synonyms);
          antonyms.push(...information[i].meanings[index].antonyms);
          for (let j = 0; j < definitions.length; j++) {
            description += `${j + 1}. ${definitions[j].definition} ${definitions[j].example ? `*Example:* ${definitions[j].example}` : ''}\n`;
          }
          newEmbed.setDescription(description);
          embeds.push(embed);
        }
      }

      pagination.setEmbeds(embeds, (pagEmbed, index, array) => {
        if (synonyms.length) {
          const synonymSet = new Set(synonyms);
          pagEmbed.addFields({ name: 'Synonyms', value: [...synonymSet].join(', ') })
        }
        if (antonyms.length) {
          const antonymSet = new Set(antonyms);
          pagEmbed.addFields({ name: 'Antonym', value: [...antonymSet].join(', ') });
        }
        return pagEmbed.setTitle('Word of the Day')
        .setURL('https://www.dictionary.com/e/word-of-the-day/')
        .setAuthor({ name: 'Dictionary.com', iconURL: 'https://e7.pngegg.com/pngimages/801/557/png-clipart-dictionary-com-android-mobile-phones-dictionary-blue-english.png', url: 'https://www.dictionary.com'})
        .setFooter({ text: `Possible thanks to The free dictionary API https://dictionaryapi.dev/ Page ${index + 1} / ${array.length}` });
      });

      return pagination.render();
    }
    else {
      return interaction.followUp(`Please tell Beat what you did to get here.`)
    }
  }
}