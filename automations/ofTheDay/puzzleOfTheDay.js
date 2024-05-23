'use strict';

const { chromium } = require('playwright');

module.exports = async function puzzleOfTheDay() {
  console.log('getting puzzle of the day ...');
  try {
    const browser = await chromium.launch({
      headless: false,
    });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();
    await page.goto('https://www.brainbashers.com/showpuzzles.asp?field=random');
    const data = await page.evaluate(() => {
      const puzzleElements = document.querySelectorAll('p.puzzle_code');
      const puzzleCodes = [];
      puzzleElements.forEach(element => {
        const puzzleCode = element.textContent.trim().replace(/^Share link – /, '');
        puzzleCodes.push(puzzleCode);
      });
      return puzzleCodes;
    });
    const index = Math.floor(Math.random() * data.length);
    await browser.close();
    return { puzzleOTD: data[index] };
  } catch (error) {
    console.log('something went wrong with puzzle of the day', error);
    return { puzzleOTD: null };
  }
}