'use strict';

const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async function puzzleOfTheDay() {
  console.log('getting puzzle of the day ...');
  try {
    // Fetch the HTML content of the page
    const response = await axios.get('https://www.brainbashers.com/showpuzzles.asp?field=random');
    const html = response.data;

    // Load the HTML content into Cheerio
    const $ = cheerio.load(html);

    // Extract puzzle codes
    const puzzleElements = $('p.puzzle_code');
    const puzzleCodes = puzzleElements.map((index, element) => {
      return $(element).text().trim().replace(/^Share link – /, '');
    }).get();

    // Select a random puzzle code
    const index = Math.floor(Math.random() * puzzleCodes.length);
    const puzzleOTD = puzzleCodes[index];

    return { puzzleOTD };
  } catch (error) {
    console.log('something went wrong with puzzle of the day', error);
    return { puzzleOTD: null };
  }
}