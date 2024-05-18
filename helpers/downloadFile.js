'use strict';

const axios = require('axios');
const fs = require('fs/promises');

module.exports = async function downloadFile(url, outputFilePath) {
  const response = await axios.get(url, {
    responseType: 'arraybuffer', // Set the responseType to 'arraybuffer' to receive binary data
  });

  // Write the binary data to the output file
  await fs.writeFile(outputFilePath, response.data);
}