
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const countryNamesAndCodes = require('../../countryNamesAndCodes.json');

module.exports = {
  data: new SlashCommandBuilder().setName('country')
  .setDescription('Get information about a country')
  .addStringOption(option => option.setName('country').setDescription('the name of the country').setRequired(true).setAutocomplete(true)),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const country = interaction.options.getString('country');

    const countryData = await axios.get(`https://restcountries.com/v3.1/name/${country}?fullText=true`).then(res => res.data[0])
    const embed = new EmbedBuilder().setTitle(`${countryData.name.official}`).setImage(countryData.coatOfArms.png).setAuthor({ name: countryData.name.common, iconURL: countryData.flags.png });
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
      { name: 'CCN3 code', value: countryData.ccn3, inline: true }
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
    await interaction.followUp({ embeds: [embed] })
  },
  async autocomplete(interaction) {
    let focusedValue = interaction.options.getFocused(true);
    // initial whitespace is causing it to send all results which results in a crash since limit is 25
    if (focusedValue.value == '') {
      focusedValue = null;
    } else {
      focusedValue = focusedValue.value.toLowerCase();
    }
    
		const filtered = countryNamesAndCodes.filter(choice => 
      choice.commonName.toLowerCase().includes(focusedValue) || 
      choice.officialName.toLowerCase().includes(focusedValue));
		await interaction.respond(
			filtered.map(choice => ({ name: choice.commonName, value: choice.commonName })).slice(0, 25),
		);
  }
}