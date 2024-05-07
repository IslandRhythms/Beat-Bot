const { SlashCommandBuilder } = require('discord.js');
const { createCanvas } = require('canvas');
const GIFEncoder = require('gifencoder');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('countdown')
    .setDescription('Create a visible timer')
    .addIntegerOption(option =>
      option.setName('time')
        .setDescription('Time in seconds to begin the countdown')
        .setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply();

    const countdownDuration = interaction.options.getInteger('time') * 1000;
    const startingTime = Date.now();
    const endTime = startingTime + countdownDuration;

    const canvasWidth = 200;
    const canvasHeight = 100;
    const encoder = new GIFEncoder(canvasWidth, canvasHeight);
    const stream = fs.createWriteStream('countdown.gif');

    encoder.createReadStream().pipe(stream);
    encoder.start();
    encoder.setRepeat(-1); // 0 for repeat, -1 for no-repeat
    encoder.setDelay(1000); // 1 s delay between frames
    encoder.setQuality(1); // Lower quality for faster processing

    for (let currentTime = startingTime; currentTime <= endTime; currentTime += 1000) {
      const timeRemaining = endTime - currentTime;
      const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      const canvas = createCanvas(canvasWidth, canvasHeight);
      const ctx = canvas.getContext('2d');

      // Clear the canvas on each iteration to avoid overlaying text
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Draw countdown text on the canvas
      ctx.font = '30px sans-serif';
      ctx.fillStyle = 'red';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${hours}h ${minutes}m ${seconds}s`, canvasWidth / 2, canvasHeight / 2);

      // Add the canvas to the GIF encoder
      encoder.addFrame(ctx);
    }

     // Add the last frame with "TIME!"
     const canvas = createCanvas(canvasWidth, canvasHeight);
     const ctx = canvas.getContext('2d');
 
     // Clear the canvas
     ctx.clearRect(0, 0, canvasWidth, canvasHeight);
 
     // Draw "TIME!" on the canvas
     ctx.font = '30px sans-serif';
     ctx.fillStyle = 'red';
     ctx.textAlign = 'center';
     ctx.textBaseline = 'middle';
     ctx.fillText('TIME!', canvasWidth / 2, canvasHeight / 2);
 
     // Add the canvas to the GIF encoder
     encoder.addFrame(ctx);

    encoder.finish();
    stream.on('finish', async () => {
      console.log(`GIF generated successfully, took ${Date.now() - startingTime}ms`);
      return interaction.followUp({ files: ['countdown.gif'] });
    });
  }
};