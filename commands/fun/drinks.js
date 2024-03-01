const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { Pagination } = require('pagination.djs');


// paginate
module.exports = {
  data: new SlashCommandBuilder().setName('drinks')
  .setDescription('lookup different alcoholic beverages and their ingredients')
  .addSubcommand(subcommand => 
    subcommand.setName('name').setDescription('lookup beverage by name, returns all drinks with the name included').addStringOption(option =>
      option.setName('drink').setDescription('the name of the drink').setRequired(true)))
  .addSubcommand(subcommand => 
    subcommand.setName('letter').setDescription('lookup all beverages that start with the indicated letter').addStringOption(option =>
      option.setName('drink').setDescription('the name of the drink').setMaxLength(1).setRequired(true)))
  .addSubcommand(subcommand => 
    subcommand.setName('ingredient').setDescription('lookup information about an ingredient').addStringOption(option =>
      option.setName('component').setDescription('the ingredient you wish to look up').setRequired(true)))
  .addSubcommand(subcommand => 
    subcommand.setName('mixology').setDescription('lookup drinks with the indicated ingredient').addStringOption(option =>
      option.setName('component').setDescription('the ingredient you wish to look up').setRequired(true)))
  .addSubcommand(subcommand => 
    subcommand.setName('random').setDescription('get a random beverage')),
  async execute(interaction) {
    const pagination = new Pagination(interaction);
    await interaction.deferReply({ ephemeral: true });
    const type = interaction.options._subcommand;
    let url = `https://www.thecocktaildb.com/api/json/v1/1/`
    if (type == 'name') {
      const drink = interaction.options.getString('drink');
      url += `search.php?s=${drink}`;
    } else if (type == 'letter') {
      const letter = interaction.options.getString('drink');
      url += `search.php?f=${letter}`;
    } else if (type == 'ingredient') {
      const ingredient = interaction.options.getString('component');
      url += `search.php?i=${ingredient}`;
    } else if (type == 'mixology') {
      const ingredient = interaction.options.getString('component');
      url += `filter.php?i=${ingredient}`;
    } else { // random
      url += 'random.php';
    }
    const { drinks, ingredients } = await axios.get(url).then(res => res.data);
    const embeds = [];
    if (drinks && drinks.length) {
      drinks.forEach(drink => {
        const embed = new EmbedBuilder().setTitle(drink.strDrink)
        .setDescription(drink.strInstructions)
        .setImage(drink.strDrinkThumb)
        .addFields({ name: 'Glass', value: drink.strGlass });
        for (const [key, value] of Object.entries(drink)) {
          if (key.startsWith('strIngredient') && value) {
            const index = key.replace('strIngredient', '');
            const measurement = drink[`strMeasure${index}`];
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
        return embed.setFooter({ text: `Possible thanks to https://www.thecocktaildb.com/api.php Page: ${index + 1}/${array.length}`});
      });
      pagination.render();
    } else if (ingredients && ingredients.length) {
      const embed = new EmbedBuilder().setTitle(ingredients[0].strIngredient).setDescription(ingredients[0].strDescription);
      return interaction.followUp({ embeds: [embed] });
    } else {
      return interaction.followUp(`Nothing found with the given query`);
    }
  }
}