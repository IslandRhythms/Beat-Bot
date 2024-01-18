require('../../config');

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
module.exports = {
  cooldown: 1800,
  data: new SlashCommandBuilder().setName('weather').setDescription('gets the weather given a latitude and longitude, or city, state, zip, and country code.')
  .addNumberOption(option => option.setName('latitude').setDescription('the latitude of the desired location.'))
  .addNumberOption(option => option.setName('longitude').setDescription('the longitude of the desired location.'))
  .addNumberOption(option => option.setName('zip').setDescription('look up weather via zip code'))
  .addStringOption(option => option.setName('countrycode').setDescription('country code i.e. US, UK, etc.'))
  .addStringOption(option => option.setName('city').setDescription('city name'))
  .addStringOption(option => option.setName('state').setDescription('state abbreviation the city is in i.e. FL, NY, etc.')),
  async execute(interaction) {
    await interaction.deferReply();
    console.log('what is interaction object', interaction.options);
    if (!interaction.options._hoistedOptions.length) {
      return interaction.followUp('You must provide either the latitude and longitude, or city, state, zip, and country');
    }
    const latitude = interaction.options.getNumber('latitude');
    const longitude = interaction.options.getNumber('longitude');
    const zip = interaction.options.getNumber('zip');
    const countrycode = interaction.options.getString('countrycode');
    const city = interaction.options.getString('city');
    const state = interaction.options.getString('state');
    let queryString = `key=${process.env.WEATHERAPIKEY}&units=I&days=7`;
    if (latitude && longitude) {
      queryString += `&lat=${latitude}&lon=${longitude}`
    } else if (zip && countrycode && city && state) {
      queryString += `&city=${city},${state}&postal_code=${zip}&country=${countrycode.toUpperCase()}`
    } else {
      return interaction.followUp('invalid option set given.');
    }
    const res = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?${queryString}`).then(res => res.data);
    console.log('what is res', res.data);
    const embed = new EmbedBuilder();
    embed.setAuthor({ name: 'https://www.weatherbit.io/', iconURL: 'https://cdn.weatherbit.io/static/img/icons/c02d.png', url: 'https://www.weatherbit.io/'});
    embed.setTitle(`7 day Forecast for ${res.city_name}, ${res.state_code}, ${res.country_code}`);
    embed.setDescription(`Today, the high will be ${res.data[0].max_temp.toString()} °F and feel like ${res.data[0].app_max_temp.toString()} °F with a low of ${res.data[0].min_temp.toString()} °F and feel like ${res.data[0].app_min_temp.toString()} °F.`)
    for (let i = 1; i < res.data.length; i++) {
      const mili = Date.parse(res.data[i].datetime);
      const date = new Date(mili);
      const today = date.getUTCDay();
      embed.addFields({ name: days[today], value: `${res.data[i].max_temp.toString()} °F / ${res.data[i].min_temp.toString()} °F`, inline: true });
    }
    embed.setThumbnail(`https://cdn.weatherbit.io/static/img/icons/${res.data[0].weather.icon}.png`)
    await interaction.followUp({ embeds: [embed] });
  }
}