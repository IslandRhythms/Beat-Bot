const puppeteer = require('puppeteer');

module.exports = async function interestingFact(db) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://deepai.org/chat');
  await page.waitForSelector('.chatbox');
  // asking it to provide a link would not link to the correct place. Better safe than sorry.
  await page.type('.chatbox', 'Tell me a random fact');
  await page.keyboard.press('Enter');
  await page.waitForSelector('.copytextButton');
  const answer = await page.$eval('.outputBox', el => el.textContent);
  // could never figure out how to get CopySummarizeDelete out, so we'll just search and strip;
  const index = answer.indexOf('CopySummarizeDelete');
  const interestingFact = answer.substring(0, index);
  await browser.close();
  return interestingFact;
};