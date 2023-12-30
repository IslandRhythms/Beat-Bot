
const puppeteer = require('puppeteer');

module.exports = async function plantOfTheDay() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  await browser.close();
  
};