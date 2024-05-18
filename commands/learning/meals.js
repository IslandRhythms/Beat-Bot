const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { Pagination } = require('pagination.djs');
const capitalizeFirstLetter = require('../../helpers/capitalizeFirstLetter');


// paginate
module.exports = {
  data: new SlashCommandBuilder().setName('meals')
  .setDescription('lookup different meals and their ingredients')
  .addSubcommand(subcommand => 
    subcommand.setName('name').setDescription('lookup meal by name').addStringOption(option =>
      option.setName('meal').setDescription('the name of the meal').setRequired(true)))
  .addSubcommand(subcommand => 
    subcommand.setName('letter').setDescription('lookup all meals that start with the indicated letter').addStringOption(option =>
      option.setName('meal').setDescription('the first letter of the name of the meal').setMaxLength(1).setRequired(true)))
  .addSubcommand(subcommand => 
    subcommand.setName('ingredient').setDescription('filter meals by the indicated main ingredient').addStringOption(option =>
      option.setName('component').setDescription('the ingredient you wish to filter by').setRequired(true)))
  .addSubcommand(subcommand => 
    subcommand.setName('category').setDescription('filter meals by the indicated category').addStringOption(option =>
      option.setName('cat').setDescription('the category you wish to filter by').setRequired(true)))
  .addSubcommand(subcommand => 
    subcommand.setName('area').setDescription('filter meals by the indicated area').addStringOption(option =>
      option.setName('location').setDescription('the area you wish to filter by').setRequired(true)))
  .addSubcommand(subcommand => 
    subcommand.setName('listingredient').setDescription('list all possible ingredients'))
  .addSubcommand(subcommand => 
    subcommand.setName('listcategory').setDescription('list all possible categories'))
  .addSubcommand(subcommand => 
    subcommand.setName('listarea').setDescription('list all possible areas'))
  .addSubcommand(subcommand => 
    subcommand.setName('sponingredient').setDescription('gets a single random ingredient'))
  .addSubcommand(subcommand => 
    subcommand.setName('sponcategory').setDescription('get a single random category'))
  .addSubcommand(subcommand => 
    subcommand.setName('sponarea').setDescription('get a single random area'))
  .addSubcommand(subcommand => 
    subcommand.setName('random').setDescription('get a random meal')),
  async execute(interaction) {
    const pagination = new Pagination(interaction);
    await interaction.deferReply({ ephemeral: true });
    const type = interaction.options._subcommand;
    let url = `https://www.themealdb.com/api/json/v1/1/`
    if (type == 'name') {
      const meal = interaction.options.getString('meal');
      url += `search.php?s=${meal}`;
    } else if (type == 'letter') {
      const meal = interaction.options.getString('meal');
      url += `search.php?f=${meal}`;
    } else if (type == 'ingredient') {
      const ingredient = interaction.options.getString('component');
      url += `filter.php?i=${ingredient}`;
    } else if (type == 'category') {
      const cat = interaction.options.getString('cat');
      url += `filter.php?c=${cat}`;
    } else if (type == 'area') {
      const location = interaction.options.getString('location');
      url += `filter.php?a=${location}`
    } else if (type.includes('list') || type.includes('spon')) {
      url += `list.php?${type[4]}=list`
      const { meals } = await axios.get(url).then(res => res.data);
      if (type.includes('spon')) {
        const random = Math.floor(Math.random() * meals.length);
        const embed = new EmbedBuilder().setTitle(meals[random][`str${capitalizeFirstLetter(type.substring(4, type.length))}`]);
        if (type.includes('ingredient') && meals[random].strDescription) {
          embed.setDescription(meals[random].strDescription);
        }
        return interaction.followUp({ embeds: [embed] });
      }
      const embeds = [];
      for (let i = 0; i < meals.length; i++) {
        const embed = new EmbedBuilder().setTitle(meals[i][`str${capitalizeFirstLetter(type.substring(4, type.length))}`]);
        if (type.includes('ingredient') && meals[i].strDescription) {
          embed.setDescription(meals[i].strDescription);
        }
        embeds.push(embed);
      }
      pagination.setEmbeds(embeds, (embed, index, array) => {
        return embed.setFooter({ text: `Possible thanks to https://www.themealdb.com/api.php Page: ${index + 1}/${array.length}`});
      });
      return pagination.render();
    } else { // random
      url += 'random.php';
    }
    const { meals } = await axios.get(url).then(res => res.data);

    const embeds = [];
    if (meals && meals.length) {
      meals.forEach(meal => {
        const embed = new EmbedBuilder().setTitle(meal.strMeal).setImage(meal.strMealThumb);
        if (meal.strYoutube) {
          embed.setURL(meal.strYoutube)
        }
        if (meal.strInstructions) {
          embed.setDescription(meal.strInstructions)
        }

        if (meal.strArea) {
          embed.addFields({ name: 'Area', value: meal.strArea, inline: true })
        }
        if (meal.strCategory) {
          embed.addFields({ name: 'Category', value: meal.strCategory, inline: true });
        }
        for (const [key, value] of Object.entries(meal)) {
          if (key.startsWith('strIngredient') && value) {
            const index = key.replace('strIngredient', '');
            const measurement = meal[`strMeasure${index}`];
            if (!measurement) {
              embed.addFields({ name: value, value: value, inline: true });
            } else {
              embed.addFields({ name: value, value: measurement, inline: true });
            }
          }
        }
        embeds.push(embed);
      });
      pagination.setEmbeds(embeds, (embed, index, array) => {
        return embed.setFooter({ text: `Possible thanks to https://www.themealdb.com/api.php Page: ${index + 1}/${array.length}`});
      });
      pagination.render();
    } else {
      return interaction.followUp(`Nothing found with the given query`);
    }
  }
}