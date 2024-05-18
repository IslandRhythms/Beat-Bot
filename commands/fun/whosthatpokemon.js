const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const Jimp = require('jimp');

module.exports = {
  data: new SlashCommandBuilder().setName('whosthatpokemon')
  .setDescription('Guess the pokemon')
  .addBooleanOption(option => option.setName('private').setDescription('set to false if you want to play with others. Default is true')),
  async execute(interaction) {
    const private = interaction.options.getBoolean('private') ?? true;
    await interaction.deferReply({ ephemeral: private });
    const pokedex = await axios.get('https://pokeapi.co/api/v2/pokemon-species/?limit=0').then(res => res.data); // get the total number of available pokemon to pull from
    const pokedexEntries = pokedex.count;
    const selectedPokemon = Math.floor(Math.random() * pokedexEntries);
    const pokemonData = await axios.get(`https://pokeapi.co/api/v2/pokemon/${selectedPokemon}`).then(res => res.data);
    const pokemonImageLink = pokemonData.sprites.front_default;
    const imageData = await downloadImage(pokemonImageLink);
    const image = await Jimp.read(imageData);
    image.resize(300, Jimp.AUTO);
    image.greyscale();
    image.threshold({ max: 150 });
    image.color([{ apply: 'darken', params: [200]}])


    const canvasWidth = image.getWidth();
    const canvasHeight = image.getHeight();
    const whiteCanvas = await new Jimp(canvasWidth, canvasHeight, 'white');

    whiteCanvas.composite(image, 0, 0);


    // Save the modified image
    const outputPath = `../../${pokemonData.name}Black.png`;
    await whiteCanvas.writeAsync(outputPath);
    const time = 30000; // 30 seconds
    const embed = new EmbedBuilder().setTitle(`Who's that pokemon? ${time / 1000} seconds on the clock!`).setImage(`attachment://${pokemonData.name}Black.png`)
    await interaction.followUp({ embeds: [embed], files: [{ attachment: outputPath, name: `${pokemonData.name}Black.png`}]});
    const collectorObject = {
      time: time, // Set a timeout for response collection (30 seconds in this example)
      errors: ['time'] // Handle timeout errors
    }
    if (!private) {
      collectorObject.filter = (msg) => msg.author.id === interaction.user.id;
    } else {
      collectorObject.max = 1; // Collect only one response
    }
    const collector = interaction.channel.createMessageCollector(collectorObject);
    
    
    collector.on('collect', async (msg) => {
      const userAnswer = msg.content.toLowerCase();
      if (!private && userAnswer === pokemonData.name.toLowerCase()) {
        collector.stop();
        const embed = new EmbedBuilder().setTitle(`The pokemon was ${pokemonData.name}`).setImage(pokemonImageLink);
        await interaction.followUp({ content: `${msg.author.username} is Correct 🎉`, embeds: [embed], ephemeral: !private });
      } else {
        collector.stop();
        const embed = new EmbedBuilder().setTitle(`The pokemon was ${pokemonData.name}`).setImage(pokemonImageLink);
        await interaction.followUp({ content: `You are ${userAnswer === pokemonData.name.toLowerCase() ? 'Correct 🎉': 'Incorrect ❌'}`, embeds: [embed], ephemeral: private });
      }
      
      if (private) {
        await msg.delete().catch();
      }
    });
    
    collector.on('end', (collected, reason) => {
      if (reason === 'time') {
        const embed = new EmbedBuilder().setTitle(`The pokemon was ${pokemonData.name}`).setImage(pokemonImageLink);
        interaction.followUp({ content: `⌛ Time\'s up! You did not provide an answer.`, embeds: [embed], ephemeral: private });
      }
    });
  }
}

async function downloadImage(url) {
  const res = await axios.get(url, { responseType: 'arraybuffer' });
  return res.data;
}
