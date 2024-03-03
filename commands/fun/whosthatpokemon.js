const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('whosthatpokemon')
  .setDescription('Guess the pokemon'),
  async execute(interaction) {
    await interaction.deferReply();
    await interaction.followUp('Under Construction')
  }
}

// chatgpt recommendede way of making a silhouette of the subject.
/*
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

// Load the image
loadImage('input.jpg').then((image) => {
    // Create a canvas matching the image dimensions
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    // Draw the image onto the canvas
    ctx.drawImage(image, 0, 0, image.width, image.height);

    // Get the image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Convert image to silhouette
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];     // Red channel
        const g = data[i + 1]; // Green channel
        const b = data[i + 2]; // Blue channel

        // Calculate grayscale value
        const grayscale = 0.2989 * r + 0.587 * g + 0.114 * b;

        // Set grayscale value to each RGB channel
        data[i] = grayscale;         // Red
        data[i + 1] = grayscale;     // Green
        data[i + 2] = grayscale;     // Blue
        // Alpha channel remains the same
    }

    // Update image data with the modified data
    ctx.putImageData(imageData, 0, 0);

    // Save the modified image to a file
    const out = fs.createWriteStream('output.png');
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', () => console.log('The silhouette image has been created.'));
});
*/