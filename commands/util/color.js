const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const Jimp = require('jimp');

module.exports = {
  cooldown: 30,
  data: new SlashCommandBuilder().setName('color').setDescription('generates a random color palette, ignoring the standard color for text'),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const { result } = await axios.post(`http://colormind.io/api/`, { model: 'default'}).then(res => res.data);
    if (!result) {
      return interaction.followUp('No color schemes could be retrieved, please try again later')
    }
    const width = 500;
    const height = 100;

    // Create a new image with the specified dimensions
    const image = await new Jimp(width, height);

    // Define the width of each color stripe
    const stripeWidth = width / result.length;

    result.forEach((color, index) => {
      const [r, g, b] = color;
      const startX = index * stripeWidth;
      // Set the color for each stripe
      image.scan(startX, 0, stripeWidth, height, (x, y, idx) => {
        image.bitmap.data[idx] = r;   // Red
        image.bitmap.data[idx + 1] = g; // Green
        image.bitmap.data[idx + 2] = b; // Blue
        image.bitmap.data[idx + 3] = 255; // Alpha channel (fully opaque)
      });
    });
    const outputPath = `../../colorPalette.png`
    await image.writeAsync(outputPath);
    const embed = new EmbedBuilder().setTitle('Generated Color Palette Below').setImage(`attachment://colorPalette.png`).setFooter({ text: 'Possible thanks to http://colormind.io/'});
    await interaction.followUp({ embeds: [embed], files: [{ attachment: outputPath, name: `colorPalette.png` }] });
  }
}